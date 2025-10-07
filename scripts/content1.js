// content.js

(function () {
  let overlay = null;
  let overlayTimeout = null;

  // Function to get YouTube video element
  function getVideo() {
    return document.querySelector("video");
  }

  // Function to show overlay with current speed
  function showOverlay(speed) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "10%";
      overlay.style.left = "50%";
      overlay.style.transform = "translateX(-50%)";
      overlay.style.padding = "8px 14px";
      overlay.style.background = "rgba(0,0,0,0.6)";
      overlay.style.color = "#fff";
      overlay.style.fontSize = "22px";
      overlay.style.borderRadius = "6px";
      overlay.style.zIndex = "9999";
      overlay.style.transition = "opacity 0.5s ease";
      overlay.style.opacity = "0";

      document.body.appendChild(overlay);
    }

    overlay.textContent = `${speed.toFixed(2)}x`;
    overlay.style.opacity = "1";

    if (overlayTimeout) clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(() => {
      overlay.style.opacity = "0";
    }, 1200);
  }

  // Function to change playback speed
  function changeSpeed(action, step) {
    const video = getVideo();
    if (!video) return;

    let newRate = video.playbackRate;

    if (action === "fast") {
      newRate = Math.min(10, newRate + step);
    } else if (action === "slow") {
      newRate = Math.max(0.1, newRate - step);
    } else if (action === "reset") {
      newRate = 1.0;
    }

    video.playbackRate = newRate;
    showOverlay(newRate);
  }

  // Listen for messages from popup.js
  window.addEventListener("message", (event) => {
    if (event.data.type === "SPEED_YOUTUBE_ACTION") {
      changeSpeed(event.data.action, event.data.step);
    }
  });
})();
