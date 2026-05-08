export const speak = (text) => {
  if (!window.speechSynthesis) {
    console.warn("Speech not supported");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Voice settings
  utterance.lang = "en-IN";
  utterance.rate = 1;   // speed
  utterance.pitch = 1;  // tone

  window.speechSynthesis.cancel(); // stop previous speech
  window.speechSynthesis.speak(utterance);
};