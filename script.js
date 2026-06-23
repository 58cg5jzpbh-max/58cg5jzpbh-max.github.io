(function () {
    "use strict";

    // ---- CONFIG ----
    const TARGET_DATE  = new Date("2026-07-23T00:00:00Z").getTime();
    const START_DATE   = new Date("2026-06-23T00:00:00Z").getTime();
    const MINING_RATE  = 0.0031; // dollars per hour

    // ---- DOM ----
    const daysEl       = document.getElementById("days");
    const hoursEl      = document.getElementById("hours");
    const minutesEl    = document.getElementById("minutes");
    const secondsEl    = document.getElementById("seconds");
    const progressFill = document.getElementById("miningFill");
    const progressPct  = document.getElementById("progressPercent");
    const liveBalance  = document.getElementById("liveBalance");
    const toast        = document.getElementById("toast");

    // ---- HELPERS ----
    function pad(n) { return String(n).padStart(2, "0"); }

    // ---- COUNTDOWN + PROGRESS ----
    function tick() {
      const now  = Date.now();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
        progressFill.style.width = "100%";
        progressPct.textContent  = "100%";
      } else {
        daysEl.textContent    = pad(Math.floor(diff / 86400000));
        hoursEl.textContent   = pad(Math.floor(diff / 3600000) % 24);
        minutesEl.textContent = pad(Math.floor(diff / 60000) % 60);
        secondsEl.textContent = pad(Math.floor(diff / 1000) % 60);

        const total   = TARGET_DATE - START_DATE;
        const elapsed = Math.max(0, now - START_DATE);
        const pct     = Math.min(99.5, (elapsed / total) * 100);
        progressFill.style.width = pct + "%";
        progressPct.textContent  = Math.floor(pct) + "%";
      }

      // Live balance — grows each second based on mining rate
      const elapsed  = Math.max(0, now - START_DATE) / 1000; // seconds
      const earned   = (elapsed / 3600) * MINING_RATE;
      liveBalance.textContent = earned.toFixed(4);
    }

    tick();
    setInterval(tick, 1000);

    // ---- NOTIFY BUTTON ----
    function showToast() {
      toast.classList.add("show");
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
    }

    ["notifyBtn", "notifyBtn2", "notifyBtn3"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", showToast);
    });

    document.addEventListener("click", (e) => {
      if (!toast.contains(e.target) &&
          e.target.id !== "notifyBtn" &&
          e.target.id !== "notifyBtn2" &&
          e.target.id !== "notifyBtn3") {
        toast.classList.remove("show");
      }
    });
  })();