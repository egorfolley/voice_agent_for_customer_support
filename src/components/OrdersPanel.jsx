import { orderStore } from "../services/openaiAgent";
import { STATUS_COLORS, STATUS_LABELS } from "../data/orders";

const EXTRA_STATUS = {
  refunded: { color: "#75f5cb", label: "Refunded" },
  cancelled: { color: "#9fb3b1", label: "Cancelled" },
};

export default function OrdersPanel({ highlightedOrder }) {
  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <h2 className="panel-title">Order Database</h2>

      <div className="scroll-panel flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {orderStore.map((order) => {
          const isHighlighted = order.id === highlightedOrder;
          const statusStyle = EXTRA_STATUS[order.status] ?? {
            color: STATUS_COLORS[order.status],
            label: STATUS_LABELS[order.status] ?? order.status,
          };

          return (
            <div
              key={order.id}
              className="rounded-lg px-4 py-3.5 transition-all duration-300"
              style={{
                background: isHighlighted ? "linear-gradient(135deg, #114953 0%, #1f5f73 100%)" : "#11262f",
                border: `1px solid ${isHighlighted ? "#39c6b4" : "#26727f"}`,
                boxShadow: isHighlighted ? "0 0 24px #39c6b455" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold" style={{ color: "#9fc7cd" }}>{order.id}</span>
                <span className="text-xs font-semibold" style={{ color: statusStyle.color }}>{statusStyle.label}</span>
              </div>
              <p className="text-sm mt-0.5" style={{ color: "#e2f1ef" }}>{order.customer}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs" style={{ color: "#84a6aa" }}>{order.item}</span>
                <span className="text-xs font-semibold" style={{ color: "#cde7e3" }}>${order.amount.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
