(function () {
  "use strict";

  // Target date: June 23, 2026 14:30:00 UTC
  const TARGET_DATE = new Date("2026-06-23T14:30:00Z").getTime();
  const START_DATE = new Date("2025-01-01T00:00:00Z").getTime();

  // DOM Elements
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.getElementById("progressText");

  function padZero(num) {
    return String(num).padStart(2, "0");
  }

  function updateTimer() {
    const now = Date.now();
    let diff = TARGET_DATE - now;

    // If countdown is over
    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      progressBar.style.setProperty("--progress-width", "100%");
      progressBar.style.width = "100%";
      progressText.textContent = "100%";
      return;
    }

    // Calculate time units
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Update DOM
    daysEl.textContent = padZero(days);
    hoursEl.textContent = padZero(hours);
    minutesEl.textContent = padZero(minutes);
    secondsEl.textContent = padZero(seconds);

    // Calculate progress (0% → 100%)
    const totalDuration = TARGET_DATE - START_DATE;
    let elapsed = now - START_DATE;
    if (elapsed < 0) elapsed = 0;

    let progress = Math.min(100, (elapsed / totalDuration) * 100);

    // Keep bar under 100% until target is reached
    if (progress >= 99.9 && diff > 0) {
      progress = 99.5;
    }

    // Update progress bar (using pseudo-element via CSS custom property)
    progressBar.style.setProperty("--progress-width", progress + "%");
    progressBar.style.width = progress + "%";

    // Update progress text
    progressText.textContent = Math.floor(progress) + "%";
  }

  // Run immediately, then every second
  updateTimer();
  setInterval(updateTimer, 1000);
})();