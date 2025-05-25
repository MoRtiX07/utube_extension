function getVideoIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v"); // this gets video ID like "abc123XYZ"
}

async function fetchTranscript(videoId) {
  try {
    const url = `https://video.google.com/timedtext?lang=en&v=${videoId}`;
    const res = await fetch(url);
    const xml = await res.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const texts = xmlDoc.getElementsByTagName("text");

    if (texts.length === 0) return null;

    let transcript = "";
    for (let i = 0; i < texts.length; i++) {
      transcript += texts[i].textContent + " ";
    }

    return transcript.trim();
  } catch (e) {
    return null;
  }
}

(async () => {
  const videoId = getVideoIdFromUrl();
  const transcript = await fetchTranscript(videoId);
  const container = document.getElementById("transcriptContainer");

  if (transcript) {
    container.innerText = transcript;
  } else {
    container.innerText = "Transcript not available.";
  }

  document.getElementById("summarizeBtn").addEventListener("click", () => {
    chrome.storage.local.get(["aiTool", "prompt"], (data) => {
      const { aiTool, prompt } = data;
      const finalPrompt = prompt.replace("[transcript]", transcript || "Transcript unavailable.");

      let url = "";
      if (aiTool === "chatgpt") {
        url = `https://chat.openai.com/?prompt=${encodeURIComponent(finalPrompt)}`;
      } else if (aiTool === "gemini") {
        url = `https://gemini.google.com/app?prompt=${encodeURIComponent(finalPrompt)}`;
      } else if (aiTool === "claude") {
        url = `https://claude.ai/chat?prompt=${encodeURIComponent(finalPrompt)}`;
      }

      window.open(url, "_blank");
    });
  });
})();
