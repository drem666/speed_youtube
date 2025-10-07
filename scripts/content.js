(function () {
  let overlay = null;
  let overlayTimeout = null;
  let buttonsContainer = null;

  // Default step
  let defaultStep = 0.25;

  // Get YouTube video (retry if not ready)
  function getVideo() {
    return document.querySelector("video");
  }

  // Show overlay
  function showOverlay(speed) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.style.position = "fixed";
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
    buttonsContainer.style.bottom = "80px";
    buttonsContainer.style.right = "20px";
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.flexDirection = "column";
    buttonsContainer.style.gap = "6px";
    buttonsContainer.style.zIndex = "99999";
    buttonsContainer.style.background = "rgba(0, 68, 255, 0.17)";
    buttonsContainer.style.padding = "6px";
    buttonsContainer.style.borderRadius = "8px";

    const btnStyle = `
      padding: 6px 10px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;

    // Buttons
    const fastBtn = document.createElement("button");
    fastBtn.innerText = "Fast";
    fastBtn.style.cssText = btnStyle;
    fastBtn.onclick = () => changeSpeed("fast", parseFloat(stepInput.value));

    const slowBtn = document.createElement("button");
    slowBtn.innerText = "Slow";
    slowBtn.style.cssText = btnStyle;
    slowBtn.onclick = () => changeSpeed("slow", parseFloat(stepInput.value));

    const resetBtn = document.createElement("button");
    resetBtn.innerText = "Reset";
    resetBtn.style.cssText = btnStyle;
    resetBtn.onclick = () => changeSpeed("reset", parseFloat(stepInput.value));

    // Step control
    const stepContainer = document.createElement("div");
    stepContainer.style.display = "flex";
    stepContainer.style.alignItems = "center";
    stepContainer.style.gap = "4px";
    stepContainer.style.marginTop = "4px";

    const stepLabel = document.createElement("span");
    stepLabel.innerText = "Step:";
    stepLabel.style.color = "#fff";
    stepLabel.style.fontSize = "12px";

    const stepInput = document.createElement("input");
    stepInput.type = "number";
    stepInput.min = "0.1";
    stepInput.max = "10";
    stepInput.step = "0.05";
    stepInput.value = defaultStep;
    stepInput.style.width = "50px";
    stepInput.style.fontSize = "12px";

    stepContainer.appendChild(stepLabel);
    stepContainer.appendChild(stepInput);

    // Append buttons and step
    buttonsContainer.appendChild(slowBtn);
    buttonsContainer.appendChild(resetBtn);
    buttonsContainer.appendChild(fastBtn);
    buttonsContainer.appendChild(stepContainer);

    document.body.appendChild(buttonsContainer);
  }

  // Wait until video exists before adding buttons
  function waitForVideoAndInit() {
    const video = getVideo();
    if (video) {
      createButtons();
    } else {
      setTimeout(waitForVideoAndInit, 500);
    }
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "changeSpeed") {
      const video = getVideo();
      if (video) {
        video.playbackRate = request.speed;
        showOverlay(request.speed);
      }
    }
  });

  // Initialize after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForVideoAndInit);
  } else {
    waitForVideoAndInit();
  }
})();