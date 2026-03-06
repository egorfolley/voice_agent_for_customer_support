import { ORDERS } from "../data/orders";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are a friendly DoorDash customer support agent.
Identify the customer's intent, use the appropriate tool, and respond naturally. Be concise and empathetic.
Available order IDs: ${ORDERS.map((o) => o.id).join(", ")}.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "check_order_status",
      description: "Returns current order details for a given order ID",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "The order ID, e.g. DD-1044" },
        },
        required: ["order_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "process_refund",
      description: "Marks an order as refunded and returns a confirmation",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "The order ID to refund" },
        },
        required: ["order_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cancel_order",
      description: "Cancels an order if it is still processing (not yet delivered)",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "The order ID to cancel" },
        },
        required: ["order_id"],
      },
    },
  },
];

// Mutable order store (resets on page reload — demo only)
const orderStore = ORDERS.map((o) => ({ ...o }));

function getOrder(id) {
  return orderStore.find((o) => o.id === id.toUpperCase());
}

function executeTool(name, args) {
  const order = getOrder(args.order_id);

  if (name === "check_order_status") {
    if (!order) return { error: `Order ${args.order_id} not found.` };
    return { order_id: order.id, customer: order.customer, item: order.item, amount: order.amount, status: order.status };
  }

  if (name === "process_refund") {
    if (!order) return { error: `Order ${args.order_id} not found.` };
    order.status = "refunded";
    return { success: true, order_id: order.id, refunded_amount: order.amount, message: `Refund of $${order.amount} issued to ${order.customer}.` };
  }

  if (name === "cancel_order") {
    if (!order) return { error: `Order ${args.order_id} not found.` };
    if (order.status === "delivered") return { success: false, reason: "Order already delivered, cannot cancel." };
    order.status = "cancelled";
    return { success: true, order_id: order.id, message: `Order ${order.id} has been cancelled.` };
  }

  return { error: "Unknown tool" };
}

// Persistent conversation history — survives across turns
let conversationHistory = [{ role: "system", content: SYSTEM_PROMPT }];

export function resetConversation() {
  conversationHistory = [{ role: "system", content: SYSTEM_PROMPT }];
}

/**
 * Runs the GPT-4o tool-calling loop.
 * Appends to conversationHistory so each call builds on the previous turns.
 * onStep({ type, label, value, orderId? }) is called for each reasoning event.
 * Returns the final assistant text response.
 */
export async function runAgent(userText, onStep) {
  if (!API_KEY || API_KEY.startsWith("sk-your")) {
    throw new Error("Missing VITE_OPENAI_API_KEY in .env");
  }

  conversationHistory.push({ role: "user", content: userText });
  onStep({ type: "intent", label: "Sending to GPT-4o", value: `"${userText}"` });

  // Up to 5 rounds to handle chained tool calls
  for (let round = 0; round < 5; round++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o", messages: conversationHistory, tools: TOOLS, tool_choice: "auto" }),
    });

    if (!res.ok) {
      conversationHistory.pop(); // remove the failed user message
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI error ${res.status}`);
    }

    const data = await res.json();
    const assistantMsg = data.choices[0].message;
    conversationHistory.push(assistantMsg);

    // No tool calls — final response
    if (!assistantMsg.tool_calls?.length) {
      return assistantMsg.content;
    }

    // Execute each tool call and push results into history
    for (const call of assistantMsg.tool_calls) {
      const args = JSON.parse(call.function.arguments);
      const toolName = call.function.name;

      onStep({
        type: "tool",
        label: "Tool Call",
        value: `${toolName}(${JSON.stringify(args)})`,
        orderId: args.order_id?.toUpperCase(),
      });

      const result = executeTool(toolName, args);

      onStep({
        type: "result",
        label: "Tool Result",
        value: JSON.stringify(result),
        orderId: args.order_id?.toUpperCase(),
      });

      conversationHistory.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }

  return "I've processed your request.";
}

export { orderStore };
