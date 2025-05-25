function getVideoIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

async function fetchAvailableTranscriptLangs(videoId) {
  try {
    const url = `https://video.google.com/timedtext?type=list&v=${videoId}`;
    const res = await fetch(url);
    const xml = await res.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const tracks = xmlDoc.getElementsByTagName("track");

    const langs = [];
    for (let i = 0; i < tracks.length; i++) {
      const lang = tracks[i].getAttribute("lang_code");
      if (lang) langs.push(lang);
    }
    return langs;
  } catch {
    return [];
  }
}

async function fetchTranscript(videoId, lang = "en") {
  try {
    const url = `https://video.google.com/timedtext?lang=${lang}&v=${videoId}`;
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
  } catch {
    return null;
  }
}

async function getTranscriptForVideo(videoId) {
  const availableLangs = await fetchAvailableTranscriptLangs(videoId);
  if (!availableLangs || availableLangs.length === 0) return null;

  // Prefer English, otherwise use first available
  const langToUse = availableLangs.includes("en") ? "en" : availableLangs[0];
  return await fetchTranscript(videoId, langToUse);
}

async function injectSidebar() {
  if (document.getElementById("transcript-sidebar")) return; // avoid duplicates

  const sidebar = document.createElement("div");
  sidebar.id = "transcript-sidebar";
  sidebar.style.position = "fixed";
  sidebar.style.top = "80px";
  sidebar.style.right = "0";
  sidebar.style.width = "320px";
  sidebar.style.height = "80%";
  sidebar.style.background = "#1e1e1e";  // dark background for contrast
  sidebar.style.color = "#ff0000";       // red text as you requested
  sidebar.style.borderLeft = "4px solid #ff0000";
  sidebar.style.zIndex = "9999";
  sidebar.style.overflowY = "auto";
  sidebar.style.padding = "15px";
  sidebar.style.fontFamily = "'Roboto', sans-serif";
  sidebar.style.fontSize = "14px";
  sidebar.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.7)";
  sidebar.style.borderRadius = "4px 0 0 4px";
  sidebar.style.animation = "slideIn 0.5s ease forwards";

  sidebar.innerHTML = `
    <h3 style="margin-top:0; color:#ff4444; font-weight:700; text-align:center;">Transcript</h3>
    <div id="transcriptContainer" style="white-space: pre-wrap; line-height:1.5; margin-bottom: 15px;">Loading...</div>
    <button id="summarizeBtn" style="
      background: #ff0000;
      color: #1e1e1e;
      border: none;
      padding: 10px;
      width: 100%;
      font-weight: 700;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.3s ease;
    ">Summarize</button>
    <style>
      @keyframes slideIn {
        from { right: -350px; opacity: 0; }
        to { right: 0; opacity: 1; }
      }
      #summarizeBtn:hover {
        background: #cc0000;
      }
    </style>
  `;

  document.body.appendChild(sidebar);

  const videoId = getVideoIdFromUrl();
  const transcript = await getTranscriptForVideo(videoId);
  const container = document.getElementById("transcriptContainer");

  if (transcript) {
    container.innerText = transcript;
  } else {
    container.innerText = "Transcript not available.";
  }

  document.getElementById("summarizeBtn").addEventListener("click", () => {
    chrome.storage.local.get(["aiTool", "prompt"], (data) => {
      const { aiTool, prompt } = data;
      const finalPrompt = prompt ? prompt.replace("[transcript]", transcript || "Transcript unavailable.") : transcript || "Transcript unavailable.";

      let url = "";
      if (aiTool === "chatgpt") {
        url = `https://chat.openai.com/?prompt=${encodeURIComponent(finalPrompt)}`;
      } else if (aiTool === "gemini") {
        url = `https://gemini.google.com/app?prompt=${encodeURIComponent(finalPrompt)}`;
      } else if (aiTool === "claude") {
        url = `https://claude.ai/chat?prompt=${encodeURIComponent(finalPrompt)}`;
      } else {
        alert("Please select your AI tool in the extension settings.");
        return;
      }

      window.open(url, "_blank");
    });
  });
}

// Only inject sidebar on YouTube video pages
if (window.location.href.includes("youtube.com/watch")) {
  injectSidebar();
}
