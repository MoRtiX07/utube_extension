# YouTube Transcript Summarizer Chrome Extension

---

## Overview

This Chrome extension enhances your YouTube experience by displaying video transcripts in a sidebar and enabling quick summarization of the video content using popular AI platforms like **ChatGPT**, **Gemini**, and **Claude**.

---

## Features

- **Transcript Sidebar:** Automatically fetches and displays the transcript of the currently playing YouTube video (if available).
- **Summarize Button:** Opens your preferred AI platform in a new tab with a customizable summary prompt including the transcript.
- **User Preferences:** Save your choice of AI platform and summary prompt for seamless future use.
- **Settings Panel:** Easily update your AI platform and summary prompt anytime.
- **YouTube-like UI:** Sidebar styled to blend smoothly with YouTube’s design, with a sleek red and black theme.

---

## Installation

1. Clone or download this repository:

   ```bash
   git clone https://github.com/yourusername/youtube-transcript-summarizer.git
Open Google Chrome and navigate to chrome://extensions/.

Enable Developer mode (toggle in the top-right corner).

Click Load unpacked and select the folder where the project files are located.

Navigate to any YouTube video page with subtitles and the extension will automatically display the transcript sidebar.

Usage
Click the extension icon to select your preferred AI platform and customize the summary prompt.

When you open a YouTube video, the transcript will load automatically in the sidebar.

Click the Summarize button to open your chosen AI platform in a new tab with the transcript and prompt pre-filled.

Adjust settings anytime via the extension popup.

Technical Details
Manifest Version: 3

Technologies: JavaScript (ES6+), Chrome Extensions API, HTML, CSS

Transcript Source: YouTube’s timed text XML API (video.google.com/timedtext)

Storage: Uses chrome.storage.local to save user preferences

Limitations
Transcripts are only available if the YouTube video has subtitles enabled.

Currently supports English transcripts.

The summarize button opens AI platform web interfaces — no direct API integration.

Future Improvements
Support for multiple languages.

Direct AI API integration for instant summarization inside the extension.

Enhanced UI with better error handling and loading states.

"Copy Transcript" feature.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For any questions or feedback, please open an issue or contact me at: [arhamsaifi649@gmail.com]

Thank you for checking out the YouTube Transcript Summarizer!
