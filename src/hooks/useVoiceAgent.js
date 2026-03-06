import { useState, useCallback, useRef } from "react";
import { runAgent, resetConversation } from "../services/openaiAgent";
import { speak } from "../services/elevenlabs";

function normalizeOrderId(text) {
  return text
    .replace(/\bdouble[-\s]?d\b/gi, "DD")
    .replace(/\bd\.d\.\s*/gi, "DD")
    .replace(/\bd\s+d\b/gi, "DD")
    .replace(/\bdee[-\s]?dee\b/gi, "DD")
    .replace(/\bde[-\s]?de\b/gi, "DD")
    .replace(/\bDD\s+(\d+)\b/g, "DD-$1")
    .replace(/\bDD-(\d+):(\d+)\b/g, "DD-$1$2")
    .replace(/\b(\d+):(\d+)\b/g, "$1$2");
}

export function useVoiceAgent() {
  const [transcript, setTranscript] = useState("");
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [highlightedOrder, setHighlightedOrder] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const turnRef = useRef(0);

  const processTranscript = useCallback(async (text) => {
    const normalized = normalizeOrderId(text);
    const turn = ++turnRef.current;

    setTranscript(normalized);
    setResolution(null);
    setIsProcessing(true);

    // Append a turn divider (skip for first turn)
    setReasoningSteps((prev) => [
      ...prev,
      ...(turn > 1 ? [{ type: "divider", turn, id: `divider-${turn}` }] : []),
      { type: "user", label: "You", value: normalized, turn, id: `user-${turn}` },
    ]);

    try {
      const finalResponse = await runAgent(normalized, (step) => {
        setReasoningSteps((prev) => [...prev, { ...step, turn, id: Date.now() + Math.random() }]);
        if (step.orderId) setHighlightedOrder(step.orderId);
      });

      setReasoningSteps((prev) => [
        ...prev,
        { type: "success", label: "Agent Response", value: finalResponse, turn, id: Date.now() },
      ]);
      setResolution({ message: finalResponse });
      setIsProcessing(false);

      try {
        setIsSpeaking(true);
        await speak(finalResponse);
      } catch (ttsErr) {
        console.warn("TTS error:", ttsErr.message);
      } finally {
        setIsSpeaking(false);
      }
      return;
    } catch (err) {
      setReasoningSteps((prev) => [
        ...prev,
        { type: "error", label: "Error", value: err.message, turn, id: Date.now() },
      ]);
    }

    setIsProcessing(false);
  }, []);

  const resetChat = useCallback(() => {
    resetConversation();
    turnRef.current = 0;
    setTranscript("");
    setReasoningSteps([]);
    setHighlightedOrder(null);
    setResolution(null);
    setIsProcessing(false);
    setIsSpeaking(false);
  }, []);

  return { transcript, reasoningSteps, highlightedOrder, resolution, isProcessing, isSpeaking, processTranscript, resetChat };
}
