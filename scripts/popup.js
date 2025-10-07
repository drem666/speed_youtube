// popup.js

// Get elements
const slowBtn = document.getElementById("slowBtn");
const resetBtn = document.getElementById("resetBtn");
const fastBtn = document.getElementById("fastBtn");
const stepCheckbox = document.getElementById("stepCheckbox");
const stepValue = document.getElementById("stepValue");

// Default increment step
let defaultStep = 0.25;

// Function to get the step value
function getStep() {
  if (stepCheckbox.checked) {
    let val = parseFloat(stepValue.value);
    if (isNaN(val) || val <= 0) return defaultStep;
    return val;
  }
  return defaultStep;
}

// Send message to content script
function sendMessage(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (act, step) => {
        window.postMessage({ type: "SPEED_YOUTUBE_ACTION", action: act, step: step }, "*");
      },
      args: [action, getStep()]
    });
  });
}

// Event listeners
slowBtn.addEventListener("click", () => sendMessage("slow"));
resetBtn.addEventListener("click", () => sendMessage("reset"));
fastBtn.addEventListener("click", () => sendMessage("fast"));

// Updating current speed
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const slowBtn = document.getElementById('slowBtn');
  const resetBtn = document.getElementById('resetBtn');
  const fastBtn = document.getElementById('fastBtn');
  const stepCheckbox = document.getElementById('stepCheckbox');
  const stepValue = document.getElementById('stepValue');
  const currentSpeed = document.getElementById('currentSpeed');
  
  // Initialize with default speed
  let speed = 1.0;
  
  // Update current speed display
  function updateSpeedDisplay() {
    currentSpeed.textContent = speed.toFixed(1) + 'x';
  }
  
  // Get active YouTube tab and change playback rate
  function changePlaybackRate(newSpeed) {
    // Restrict speed to valid range
    speed = Math.max(0.1, Math.min(10, newSpeed));
    updateSpeedDisplay();
    
    // Query for the active YouTube tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].url.includes('youtube.com')) {
        // Send message to content script to change playback rate
        chrome.tabs.sendMessage(tabs[0].id, {action: "changeSpeed", speed: speed});
      }
    });
  }
  
  // Set up button event listeners
  slowBtn.addEventListener('click', function() {
    const step = stepCheckbox.checked ? parseFloat(stepValue.value) : 0.25;
    changePlaybackRate(speed - step);
  });
  
  resetBtn.addEventListener('click', function() {
    changePlaybackRate(1.0);
  });
  
  fastBtn.addEventListener('click', function() {
    const step = stepCheckbox.checked ? parseFloat(stepValue.value) : 0.25;
    changePlaybackRate(speed + step);
  });
  
  // Initialize display
  updateSpeedDisplay();
});