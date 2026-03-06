import { useEffect, useRef } from "react";
import { useVoiceAgent } from "./hooks/useVoiceAgent";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { stopSpeaking } from "./services/elevenlabs";
import CustomerPanel from "./components/CustomerPanel";
import ReasoningPanel from "./components/ReasoningPanel";
import OrdersPanel from "./components/OrdersPanel";

export default function App() {
  const { transcript, reasoningSteps, highlightedOrder, resolution, isProcessing, isSpeaking, processTranscript, resetChat } = useVoiceAgent();
  const { isListening, interimText, startListening, supported } = useSpeechRecognition(processTranscript);

  // Auto-restart mic after agent finishes speaking naturally
  const prevSpeaking = useRef(false);
  useEffect(() => {
    if (prevSpeaking.current && !isSpeaking && !isListening) {
      startListening();
    }
    prevSpeaking.current = isSpeaking;
  }, [isListening, isSpeaking, startListening]);

  // Interrupt: stop audio immediately and start listening
  function handleMicClick() {
    if (isSpeaking) stopSpeaking();
    startListening();
  }

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-one" aria-hidden="true" />
      <div className="background-orb background-orb-two" aria-hidden="true" />

      <main className="panel-grid">
        <section className="panel-card">
          <CustomerPanel
            isListening={isListening}
            interimText={interimText}
            transcript={transcript}
            resolution={resolution}
            isSpeaking={isSpeaking}
            onStart={handleMicClick}
            supported={supported}
          />
        </section>

        <section className="panel-card">
          <ReasoningPanel steps={reasoningSteps} isProcessing={isProcessing} />
        </section>

        <section className="panel-card">
          <OrdersPanel highlightedOrder={highlightedOrder} />
        </section>
      </main>
    </div>
  );
}
