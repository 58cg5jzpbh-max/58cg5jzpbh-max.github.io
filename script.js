(function () {
    "use strict";

    // ---------- CONFIG ----------
    // Withdrawal opens 30 days from now — July 23, 2026
    const TARGET_DATE = new Date("2026-07-23T00:00:00Z").getTime();
    const START_DATE = new Date("2026-06-23T00:00:00Z").getTime();

    // ---------- DOM REFS ----------
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const notifyBtn = document.getElementById("notifyBtn");
    const toast = document.getElementById("toast");

    // ---------- HELPERS ----------
    function padZero(num) {
      return String(num).padStart(2, "0");
    }

    // ---------- UPDATE TIMER ----------
    function updateTimer() {
      const now = Date.now();
      let diff = TARGET_DATE - now;

      // Countdown finished
      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        progressFill.style.width = "100%";
        progressPercent.textContent = "100%";
        return;
      }

      // Calculate time
      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      // Update DOM
      daysEl.textContent = padZero(days);
      hoursEl.textContent = padZero(hours);
      minutesEl.textContent = padZero(minutes);
      secondsEl.textContent = padZero(seconds);

      // Calculate progress
      const totalDuration = TARGET_DATE - START_DATE;
      let elapsed = now - START_DATE;
      if (elapsed < 0) elapsed = 0;

      let progress = Math.min(100, (elapsed / totalDuration) * 100);

      if (progress >= 99.9 && diff > 0) {
        progress = 99.5;
      }

      progressFill.style.width = progress + "%";
      progressPercent.textContent = Math.floor(progress) + "%";
    }

    // ---------- NOTIFY BUTTON ----------
    notifyBtn.addEventListener("click", function () {
      toast.classList.add("show");

      clearTimeout(window.toastTimeout);
      window.toastTimeout = setTimeout(function () {
        toast.classList.remove("show");
      }, 4000);
    });

    // ---------- CLICK OUTSIDE TOAST ----------
    document.addEventListener("click", function (e) {
      if (!toast.contains(e.target) && e.target !== notifyBtn) {
        toast.classList.remove("show");
      }
    });

    // ---------- INIT ----------
    updateTimer();
    setInterval(updateTimer, 1000);
  })();