document.addEventListener("DOMContentLoaded", () => {
  const platformSelect = document.getElementById("platform");
  const promptInput = document.getElementById("prompt");
  const saveBtn = document.getElementById("save");

  // Load saved settings
  chrome.storage.local.get(["platform", "prompt"], (data) => {
    platformSelect.value = data.platform || "chatgpt";
    promptInput.value = data.prompt || "Summarize this YouTube video: [transcript]";
  });

  // Save settings
  saveBtn.addEventListener("click", () => {
    const platform = platformSelect.value;
    const prompt = promptInput.value;

    chrome.storage.local.set({ platform, prompt }, () => {
      alert("Settings saved!");
    });
  });
});
