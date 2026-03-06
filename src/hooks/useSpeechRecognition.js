import { useState, useRef } from "react";

export function useSpeechRecognition(onFinal) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const finalRef = useRef("");

  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  function startListening() {
    if (!supported || isListening) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    finalRef.current = "";

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setInterimText("");
    };

    recognition.onresult = (e) => {
      let interim = "";
      let final = "";
      for (const result of e.results) {
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      if (final) finalRef.current = final;
      setInterimText(final || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
      if (finalRef.current) onFinal(finalRef.current.trim());
    };

    recognition.onerror = (e) => {
      console.warn("SpeechRecognition error:", e.error);
      setIsListening(false);
      setInterimText("");
    };

    recognition.start();
  }

  return { isListening, interimText, startListening, supported };
}
