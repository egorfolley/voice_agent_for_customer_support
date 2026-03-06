const STEP_STYLES = {
  user: { dot: "#a6c2c7", bg: "#a6c2c71f" },
  intent: { dot: "#7ed8f5", bg: "#7ed8f526" },
  entity: { dot: "#ffd166", bg: "#ffd16624" },
  tool: { dot: "#39c6b4", bg: "#39c6b429" },
  result: { dot: "#74c9d7", bg: "#74c9d724" },
  success: { dot: "#3fd58f", bg: "#3fd58f26" },
  error: { dot: "#ff897d", bg: "#ff897d24" },
};

export default function ReasoningPanel({ steps, isProcessing }) {
  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <h2 className="panel-title">Agent Reasoning</h2>

      <div className="scroll-panel flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {steps.length === 0 && (
          <p className="text-sm italic mt-4 text-center" style={{ color: "#7a9693" }}>Agent idle...</p>
        )}
        {steps.map((step) => {
          if (step.type === "divider") {
            return (
              <div key={step.id} className="flex items-center gap-2 my-1 animate-fadeIn">
                <div className="flex-1 h-px" style={{ background: "#39c6b445" }} />
                <span className="text-xs" style={{ color: "#7a9693" }}>Turn {step.turn}</span>
                <div className="flex-1 h-px" style={{ background: "#39c6b445" }} />
              </div>
            );
          }

          const style = STEP_STYLES[step.type] || STEP_STYLES.result;
          return (
            <div
              key={step.id}
              className="rounded-lg px-4 py-3 flex items-start gap-3 animate-fadeIn"
              style={{ background: style.bg }}
            >
              <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: style.dot }} />
              <div className="min-w-0">
                <span className="text-xs font-semibold" style={{ color: style.dot }}>{step.label}</span>
                <p className="text-xs mt-0.5 break-words" style={{ color: "#d4e7e4" }}>{step.value}</p>
              </div>
            </div>
          );
        })}
        {isProcessing && (
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#57e5d0", animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#57e5d0", animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#57e5d0", animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  );
}
