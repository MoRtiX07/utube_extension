document.getElementById("save").addEventListener("click", () => {
  const aiTool = document.getElementById("aiTool").value;
  const prompt = document.getElementById("prompt").value;

  chrome.storage.local.set({ aiTool, prompt }, () => {
    alert("Preferences saved!");
  });
});
