/**
 * Site-wide: mobile nav; "Plan your trip" demos (DOM APIs, several event types, timers).
 */
(function () {
  "use strict";

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("header nav");

  function closeNav() {
    if (nav) {
      nav.classList.remove("active");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function (event) {
      nav.classList.toggle("active");
      const status = document.getElementById("tipStatus");
      if (status && event instanceof MouseEvent) {
        status.textContent = "Menu toggled (mouse button " + event.button + ").";
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("active")) {
        closeNav();
        event.preventDefault();
      }
    });
  }

  const tipsPanel = document.getElementById("tipsPanel");
  const tipsList = document.getElementById("tipsList");
  const tipCountEl = document.getElementById("tipCount");
  const addTipBtn = document.getElementById("addTipBtn");
  const removeLastTipBtn = document.getElementById("removeLastTipBtn");
  const shuffleTipsBtn = document.getElementById("shuffleTipsBtn");
  const tipStatus = document.getElementById("tipStatus");
  const tripIntro = document.getElementById("tripIntro");
  const emphasizeIntroBtn = document.getElementById("emphasizeIntroBtn");
  const resetIntroBtn = document.getElementById("resetIntroBtn");
  const togglePanelBtn = document.getElementById("togglePanelBtn");
  const demoStayLink = document.getElementById("demoStayLink");
  const liveClock = document.getElementById("liveClock");
  const tipsHeading = document.getElementById("tips-heading");

  const introOriginal = tripIntro ? tripIntro.textContent : "";

  const extraTips = [
    "Pack a day bag for excursions.",
    "Download offline maps before you fly.",
    "Check passport expiry six months ahead.",
    "Notify your bank before international trips.",
    "Weigh your luggage before the airport.",
    "Make sure your carry-on bags are the proper sizes.",
  ];
  let tipIndex = 0;

  function updateTipCount() {
    if (tipCountEl && tipsList) {
      tipCountEl.textContent = String(tipsList.children.length);
    }
  }

  function shuffleTipItems() {
    if (!tipsList) {
      return;
    }
    const items = Array.from(tipsList.children);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    items.forEach(function (li) {
      tipsList.appendChild(li);
    });
  }

  if (liveClock) {
    function tickClock() {
      liveClock.textContent = "Local time: " + new Date().toLocaleTimeString();
    }
    tickClock();
    setInterval(tickClock, 1000);
  }

  if (addTipBtn && tipsList && tipStatus) {
    addTipBtn.addEventListener("click", function () {
      const text = extraTips[tipIndex % extraTips.length];
      tipIndex += 1;

      const li = document.createElement("li");
      li.textContent = text;
      tipsList.append(li);

      tipStatus.textContent = "Added a new list item: \"" + text + "\"";
      updateTipCount();
    });
  }

  if (removeLastTipBtn && tipsList && tipStatus) {
    removeLastTipBtn.addEventListener("click", function () {
      if (tipsList.children.length <= 1) {
        tipStatus.textContent = "Keep at least one tip in the list.";
        return;
      }
      tipsList.removeChild(tipsList.lastElementChild);
      tipStatus.textContent = "Removed the last tip (removeChild).";
      updateTipCount();
    });
  }

  if (shuffleTipsBtn && tipsList && tipStatus) {
    shuffleTipsBtn.addEventListener("click", function () {
      shuffleTipItems();
      tipStatus.textContent = "Shuffled list order (reordered DOM nodes).";
    });
  }

  if (emphasizeIntroBtn && tripIntro && tipStatus) {
    emphasizeIntroBtn.addEventListener("click", function () {
      tripIntro.innerHTML =
        "<strong>Tip:</strong> New items use <code>createElement</code> and <code>append</code>; this line used <code>innerHTML</code>.";
      tipStatus.textContent = "Intro paragraph updated with innerHTML.";
    });
  }

  if (resetIntroBtn && tripIntro && tipStatus) {
    resetIntroBtn.addEventListener("click", function () {
      tripIntro.textContent = introOriginal;
      tipStatus.textContent = "Intro restored with textContent (plain text).";
    });
  }

  if (togglePanelBtn && tipsPanel && tipStatus) {
    togglePanelBtn.addEventListener("click", function () {
      const on = tipsPanel.classList.toggle("tips-panel-accent");
      tipStatus.textContent = on
        ? "Panel uses classList.toggle — accent style on."
        : "Panel accent style off.";
    });
  }

  if (tipsList) {
    tipsList.addEventListener("mouseover", function (event) {
      const li = event.target.closest("li");
      if (!li || !tipsList.contains(li)) {
        return;
      }
      li.classList.add("tip-hover");
    });

    tipsList.addEventListener("mouseout", function (event) {
      const li = event.target.closest("li");
      if (!li || !tipsList.contains(li)) {
        return;
      }
      li.classList.remove("tip-hover");
    });

    tipsList.addEventListener("click", function (event) {
      const li = event.target.closest("li");
      if (!li || !tipsList.contains(li)) {
        return;
      }
      li.classList.toggle("tip-pinned");
      if (tipStatus) {
        tipStatus.textContent = li.classList.contains("tip-pinned")
          ? "Pinned (click): " + li.textContent
          : "Unpinned that tip.";
      }
    });
  }

  if (tipsHeading && tipStatus) {
    tipsHeading.addEventListener("dblclick", function () {
      tipStatus.textContent = "Double-click (dblclick) on the heading.";
    });
  }

  if (demoStayLink && tipStatus) {
    demoStayLink.addEventListener("click", function (event) {
      event.preventDefault();
      tipStatus.textContent = "preventDefault() stopped the link from changing the URL.";
    });
  }
})();
