export default function CustomerPanel({ isListening, interimText, transcript, resolution, isSpeaking, onStart, supported }) {
  const busy = isListening; // isSpeaking is intentionally NOT blocking — allows interruption

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <h2 className="panel-title">Customer</h2>

      {!supported && (
        <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#3b2c11", border: "1px solid #a57a1a", color: "#ffd166" }}>
          Chrome is required for microphone support.
        </div>
      )}

      <div className="flex flex-col items-center gap-4 py-8">
        <button
          onClick={onStart}
          disabled={busy || !supported}
          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all"
          aria-label={isSpeaking ? "Interrupt speaking agent" : "Start listening"}
          style={{
            background: busy ? "linear-gradient(135deg, #1a5d63 0%, #1e6f8a 100%)" : "#0e2a31",
            border: `2px solid ${busy ? "#39c6b4" : "#2b7f8a"}`,
            opacity: !supported ? 0.4 : 1,
            boxShadow: busy ? "0 0 20px #2de2cb66" : "none",
          }}
        >
          {busy && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#2de2cb44" }} />
              <span className="absolute inset-[-6px] rounded-full animate-ping" style={{ background: "#53c3f544", animationDelay: "0.3s" }} />
            </>
          )}
          {isSpeaking ? <SpeakerIcon /> : <MicIcon active={isListening} />}
        </button>

        <span className="text-xs" style={{ color: "#9eb8b5" }}>
          {isListening ? "Listening… speak now" : isSpeaking ? "Tap to interrupt" : "Tap to speak"}
        </span>
      </div>

      <div className="flex-1 rounded-xl p-5 min-h-[100px]" style={{ background: "#11262f", border: "1px solid #2d8898" }}>
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#9ad9d0" }}>Transcript</p>
        {isListening && interimText ? (
          <p className="text-sm italic leading-relaxed" style={{ color: "#b8d5d1" }}>{interimText}</p>
        ) : transcript ? (
          <p className="text-sm leading-relaxed" style={{ color: "#e2f1ef" }}>{transcript}</p>
        ) : (
          <p className="text-sm italic" style={{ color: "#73908d" }}>Waiting for customer input...</p>
        )}
      </div>

      {resolution && (
        <div className="rounded-xl p-5" style={{ background: "#12343f", border: "1px solid #39c6b4" }}>
          <p className="text-xs mb-2 font-bold" style={{ color: "#87ecde" }}>Resolution</p>
          <p className="text-sm" style={{ color: "#def7f3" }}>{resolution.message}</p>
        </div>
      )}
    </div>
  );
}

function MicIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#57e5d0" : "#7aa0a6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0014 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#57e5d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
