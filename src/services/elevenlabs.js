const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel

let currentAudio = null;
let resolveSpeak = null;

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    URL.revokeObjectURL(currentAudio.src);
    currentAudio = null;
  }
  if (resolveSpeak) {
    resolveSpeak();
    resolveSpeak = null;
  }
}

export async function speak(text) {
  if (!API_KEY || API_KEY.startsWith("sk-your")) {
    throw new Error("Missing VITE_ELEVENLABS_API_KEY in .env");
  }

  stopSpeaking(); // stop anything already playing

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail?.message || `ElevenLabs error ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;

  return new Promise((resolve, reject) => {
    resolveSpeak = resolve;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      resolveSpeak = null;
      resolve();
    };
    audio.onerror = reject;
    audio.play();
  });
}
