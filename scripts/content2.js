(function () {
  let overlay = null;
  let overlayTimeout = null;
  let buttonsContainer = null;

  // Default step
  let defaultStep = 0.25;

  // Get YouTube video
  function getVideo() {
    return document.querySelector("video");
  }

  // Show overlay
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

  // Change video speed
  function changeSpeed(action, step = defaultStep) {
    const video = getVideo();
    if (!video) return;

    let newRate = video.playbackRate;

    if (action === "fast") newRate = Math.min(10, newRate + step);
    else if (action === "slow") newRate = Math.max(0.1, newRate - step);
    else if (action === "reset") newRate = 1.0;

    video.playbackRate = newRate;
    showOverlay(newRate);
  }

  // Create floating buttons
  function createButtons() {
    if (buttonsContainer) return;

    buttonsContainer = document.createElement("div");
    buttonsContainer.style.position = "fixed";
    buttonsContainer.style.bottom = "20px";
    buttonsContainer.style.right = "20px";
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "6px";
    buttonsContainer.style.zIndex = "9999";

    const btnStyle = `
      padding: 8px 12px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;

    const fastBtn = document.createElement("button");
    fastBtn.innerText = "Fast";
    fastBtn.style.cssText = btnStyle;
    fastBtn.onclick = () => changeSpeed("fast");

    const slowBtn = document.createElement("button");
    slowBtn.innerText = "Slow";
    slowBtn.style.cssText = btnStyle;
    slowBtn.onclick = () => changeSpeed("slow");

    const resetBtn = document.createElement("button");
    resetBtn.innerText = "Reset";
    resetBtn.style.cssText = btnStyle;
    resetBtn.onclick = () => changeSpeed("reset");

    buttonsContainer.appendChild(slowBtn);
    buttonsContainer.appendChild(resetBtn);
    buttonsContainer.appendChild(fastBtn);

    document.body.appendChild(buttonsContainer);
  }

  // Listen for messages from popup
  window.addEventListener("message", (event) => {
    if (event.data.type === "SPEED_YOUTUBE_ACTION") {
      changeSpeed(event.data.action, event.data.step);
    }
  });

  // Initialize floating buttons after page loads
  window.addEventListener("load", () => {
    createButtons();
  });

})();
