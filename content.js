// Get transcript from YouTube transcript panel on the page (if available)
function getTranscriptFromPage() {
  const transcriptElems = document.querySelectorAll('#segments-container yt-formatted-string');
  if (!transcriptElems.length) return null;

  let transcript = "";
  transcriptElems.forEach(elem => {
    transcript += elem.innerText + " ";
  });
  return transcript.trim();
}

// Fetch transcript via YouTube timedtext API (fallback)
async function fetchTranscript(videoId) {
  if (!videoId) return null;
  try {
    const res = await fetch(`https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`);
    if (!res.ok) return null;
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
    const texts = xml.getElementsByTagName("text");

    if (texts.length === 0) return null;

    let transcript = "";
    for (let i = 0; i < texts.length; i++) {
      transcript += texts[i].textContent + " ";
    }

    return transcript.trim();
  } catch (err) {
    console.error("Error fetching transcript:", err);
    return null;
  }
}

// Get video ID from URL
function getVideoIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

// Unified transcript getter - first try page, then fallback
async function getTranscript() {
  let transcript = getTranscriptFromPage();
  if (transcript) return transcript;

  const videoId = getVideoIdFromUrl();
  return await fetchTranscript(videoId);
}

// Create sidebar panel on right
function createSidebar() {
  if (document.getElementById("transcript-sidebar")) return;

  const sidebar = document.createElement("div");
  sidebar.id = "transcript-sidebar";
  sidebar.className = "yt-transcript-sidebar";

  // You can move styles to CSS file for cleaner code
  sidebar.style.position = "fixed";
  sidebar.style.top = "0";
  sidebar.style.right = "0";
  sidebar.style.width = "320px";
  sidebar.style.height = "100%";
  sidebar.style.background = "#f9f9f9";
  sidebar.style.borderLeft = "2px solid #ccc";
  sidebar.style.padding = "10px";
  sidebar.style.overflowY = "auto";
  sidebar.style.zIndex = "2147483647";  // max z-index to stay on top

  sidebar.innerHTML = `
    <h3 style="margin-top:0;">Transcript</h3>
    <p id="transcript-text">Loading transcript...</p>
  `;

  document.body.appendChild(sidebar);

  getTranscript().then(transcript => {
    document.getElementById("transcript-text").innerText =
      transcript || "Transcript not available for this video.";
  });
}

// Create Summarize button next to sidebar
function createSummarizeButton() {
  if (document.getElementById("summarize-btn")) return;

  const button = document.createElement("button");
  button.id = "summarize-btn";
  button.className = "yt-summarize-btn";
  button.innerText = "Summarize";

  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "340px";  // next to sidebar
  button.style.padding = "10px 15px";
  button.style.backgroundColor = "#ff0000";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.zIndex = "2147483647";

  button.onclick = () => {
    const transcript = document.getElementById("transcript-text").innerText;
    chrome.storage.local.get(["platform", "prompt"], (data) => {
      const platform = data.platform || "chatgpt";
      const promptTemplate = data.prompt || "Summarize this YouTube video: [transcript]";
      const prompt = promptTemplate.replace("[transcript]", transcript);
      const encodedPrompt = encodeURIComponent(prompt);

      let url = "";
      switch (platform) {
        case "chatgpt":
          url = `https://chat.openai.com/?q=${encodedPrompt}`;
          break;
        case "gemini":
          url = `https://gemini.google.com/app?q=${encodedPrompt}`;
          break;
        case "claude":
          url = `https://claude.ai/chat?q=${encodedPrompt}`;
          break;
        default:
          url = `https://chat.openai.com/?q=${encodedPrompt}`;
      }

      window.open(url, "_blank");
    });
  };

  document.body.appendChild(button);
}

// Run after YouTube page loads
window.addEventListener("load", () => {
  setTimeout(() => {
    createSidebar();
    createSummarizeButton();
  }, 3000); // small delay to ensure page loaded
});
