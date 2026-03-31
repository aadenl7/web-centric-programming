/**
 * Site-wide script
 * - Mobile navigation controls
 * - Interactive "Plan your trip" demo block
 * - Optional travel form validation
 * - Back-to-top button
 * - Optional destination finder widget
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1) Mobile navigation
  // ---------------------------------------------------------------------------
  // Select the menu toggle button and nav container used on small screens.
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("header nav");

  // Helper used by multiple events to collapse the mobile menu.
  function closeNav() {
    if (nav) {
      nav.classList.remove("active");
    }
  }

  // Attach nav listeners only on pages that include both elements.
  if (toggle && nav) {
    // Click: open/close nav and report which mouse button triggered it.
    toggle.addEventListener("click", function (event) {
      nav.classList.toggle("active");
      const status = document.getElementById("tipStatus");
      if (status && event instanceof MouseEvent) {
        status.textContent = "Menu toggled (mouse button " + event.button + ").";
      }
    });

    // Keyboard: Escape closes nav and prevents default key behavior.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("active")) {
        closeNav();
        event.preventDefault();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2) "Plan your trip" interactive demo (DOM manipulation + events)
  // ---------------------------------------------------------------------------
  // Cache all optional UI elements. On pages without this section, these are null.
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

  // Keep the original intro text so it can be restored after innerHTML changes.
  const introOriginal = tripIntro ? tripIntro.textContent : "";

  // Predefined tips to cycle through when user clicks "Add a tip".
  const extraTips = [
    "Pack a day bag for excursions.",
    "Download offline maps before you fly.",
    "Check passport expiry six months ahead.",
    "Notify your bank before international trips.",
    "Weigh your luggage before the airport.",
    "Make sure your carry-on bags are the proper sizes.",
  ];
  let tipIndex = 0;

  // Update visible counter with the current number of <li> tips.
  function updateTipCount() {
    if (tipCountEl && tipsList) {
      tipCountEl.textContent = String(tipsList.children.length);
    }
  }

  // Shuffle list items with Fisher-Yates, then re-append in new order.
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

  // Live clock demo: update once immediately, then every second.
  if (liveClock) {
    function tickClock() {
      liveClock.textContent = "Local time: " + new Date().toLocaleTimeString();
    }
    tickClock();
    setInterval(tickClock, 1000);
  }

  // Add tip button: create a new <li>, append it, and refresh status/count.
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

  // Remove tip button: keep at least one item to avoid an empty demo state.
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

  // Shuffle button: reorder existing <li> nodes.
  if (shuffleTipsBtn && tipsList && tipStatus) {
    shuffleTipsBtn.addEventListener("click", function () {
      shuffleTipItems();
      tipStatus.textContent = "Shuffled list order (reordered DOM nodes).";
    });
  }

  // Demonstrate innerHTML with controlled/static markup.
  if (emphasizeIntroBtn && tripIntro && tipStatus) {
    emphasizeIntroBtn.addEventListener("click", function () {
      tripIntro.innerHTML =
        "<strong>Tip:</strong> New items use <code>createElement</code> and <code>append</code>; this line used <code>innerHTML</code>.";
      tipStatus.textContent = "Intro paragraph updated with innerHTML.";
    });
  }

  // Restore original intro using textContent (plain text, no HTML parsing).
  if (resetIntroBtn && tripIntro && tipStatus) {
    resetIntroBtn.addEventListener("click", function () {
      tripIntro.textContent = introOriginal;
      tipStatus.textContent = "Intro restored with textContent (plain text).";
    });
  }

  // Toggle accent class on the panel to demonstrate classList.toggle().
  if (togglePanelBtn && tipsPanel && tipStatus) {
    togglePanelBtn.addEventListener("click", function () {
      const on = tipsPanel.classList.toggle("tips-panel-accent");
      tipStatus.textContent = on
        ? "Panel uses classList.toggle — accent style on."
        : "Panel accent style off.";
    });
  }

  // List delegation: hover styles and click-to-pin on <li> items.
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

  // Demonstrate a different mouse event type.
  if (tipsHeading && tipStatus) {
    tipsHeading.addEventListener("dblclick", function () {
      tipStatus.textContent = "Double-click (dblclick) on the heading.";
    });
  }

  // Prevent default anchor behavior for demo purposes.
  if (demoStayLink && tipStatus) {
    demoStayLink.addEventListener("click", function (event) {
      event.preventDefault();
      tipStatus.textContent = "preventDefault() stopped the link from changing the URL.";
    });
  }

  // Initialize count once in case list markup changes server-side.
  updateTipCount();

  // ---------------------------------------------------------------------------
  // 3) Optional form validation (runs only on pages with #travelForm)
  // ---------------------------------------------------------------------------
  const form = document.getElementById("travelForm");
  const errorMsg = document.getElementById("errorMsg");

  if (form && errorMsg) {
    form.addEventListener("submit", function (event) {
      // Reset previous message each submit attempt.
      errorMsg.textContent = "";

      // Read all inputs once and trim where text formatting matters.
      const nameEl = document.getElementById("name");
      const emailEl = document.getElementById("email");
      const passwordEl = document.getElementById("password");
      const confirmPasswordEl = document.getElementById("confirmPassword");
      const phoneEl = document.getElementById("phone");
      const postalEl = document.getElementById("postal");
      const creditEl = document.getElementById("credit");
      const expiryEl = document.getElementById("expiry");
      const cvvEl = document.getElementById("cvv");

      // Guard in case this script is reused on a slightly different form.
      if (!nameEl || !emailEl || !passwordEl || !confirmPasswordEl) {
        return;
      }

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const password = passwordEl.value;
      const confirmPassword = confirmPasswordEl.value;
      const phone = phoneEl ? phoneEl.value.trim() : "";
      const postal = postalEl ? postalEl.value.trim() : "";
      const credit = creditEl ? creditEl.value.trim() : "";
      const expiry = expiryEl ? expiryEl.value.trim() : "";
      const cvv = cvvEl ? cvvEl.value.trim() : "";

      // Validation patterns for each field.
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
      const postalRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
      const creditRegex = /^\d{16}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvvRegex = /^\d{3}$/;
      const strongPassword = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

      // Required field check.
      if (!name || !email || !password || !confirmPassword) {
        event.preventDefault();
        errorMsg.textContent = "Please fill in all required fields.";
        return;
      }

      // Email format check.
      if (!emailRegex.test(email)) {
        event.preventDefault();
        errorMsg.textContent = "Invalid email format.";
        return;
      }

      // Password strength check.
      if (!strongPassword.test(password)) {
        event.preventDefault();
        errorMsg.textContent =
          "Password must be 6+ characters, include 1 uppercase letter and 1 number.";
        return;
      }

      // Confirm password check.
      if (password !== confirmPassword) {
        event.preventDefault();
        errorMsg.textContent = "Passwords do not match.";
        return;
      }

      // Optional field checks.
      if (phone && !phoneRegex.test(phone)) {
        event.preventDefault();
        errorMsg.textContent = "Phone must be 123-456-7890.";
        return;
      }

      if (postal && !postalRegex.test(postal)) {
        event.preventDefault();
        errorMsg.textContent = "Postal code must be A1A 1A1.";
        return;
      }

      if (credit && !creditRegex.test(credit)) {
        event.preventDefault();
        errorMsg.textContent = "Credit card must be 16 digits.";
        return;
      }

      if (expiry && !expiryRegex.test(expiry)) {
        event.preventDefault();
        errorMsg.textContent = "Expiry must be in MM/YY format.";
        return;
      }

      if (cvv && !cvvRegex.test(cvv)) {
        event.preventDefault();
        errorMsg.textContent = "CVV must be 3 digits.";
        return;
      }

      // Final success feedback.
      alert("Form submitted successfully!");
    });
  }

  // ---------------------------------------------------------------------------
  // 4) Back-to-top button (created dynamically)
  // ---------------------------------------------------------------------------
  const backToTopBtn = document.createElement("button");
  backToTopBtn.id = "backToTop";
  backToTopBtn.textContent = "↑";
  backToTopBtn.title = "Go to top";
  document.body.appendChild(backToTopBtn);

  // Show button after user scrolls down enough; hide near the top.
  window.addEventListener("scroll", function () {
    const scrolled =
      document.body.scrollTop > 300 || document.documentElement.scrollTop > 300;
    backToTopBtn.style.display = scrolled ? "block" : "none";
  });

  // Smooth-scroll to top and report status in the interactive panel (if present).
  backToTopBtn.addEventListener("click", function () {
    if (tipStatus) {
      tipStatus.textContent = "Preparing to scroll to top...";
    }

    setTimeout(function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      if (tipStatus) {
        tipStatus.textContent = "Scrolled to top!";
      }
    }, 200);
  });

  // ---------------------------------------------------------------------------
  // 5) Destination finder widget (injected dynamically into <main>)
  // ---------------------------------------------------------------------------
  const mainTag = document.querySelector("main");

  if (mainTag) {
    // Build the UI once, then append to the end of the page content.
    const filterSection = document.createElement("section");
    filterSection.className = "injected-filter";
    filterSection.innerHTML = `
      <h3 style="margin-top:0; color:#0b7285;">Quick Destination Finder</h3>
      <p style="margin-bottom:0.5rem;">Where should you go next? Pick a vibe to search:</p>
      <div class="filter-btn-group">
        <button type="button" class="f-btn" data-cat="Beach">Tropical</button>
        <button type="button" class="f-btn" data-cat="Adventure">Adventure</button>
        <button type="button" class="f-btn" data-cat="Culture">Culture</button>
      </div>
      <div id="filterLoader" style="display:none;">Searching our compass...</div>
      <div id="filterResult"><p style="margin:0; color:#627d98;">Select a category above.</p></div>
    `;
    mainTag.appendChild(filterSection);

    // Simple lookup table for destination cards by category.
    const destData = {
      Beach: { t: "The Maldives", d: "Pristine beaches and overwater bungalows." },
      Adventure: { t: "Paris, France", d: "Experience romance, art, and history in the City of Light." },
      Culture: { t: "Tokyo, Japan", d: "Vibrant city life, historic temples, and unique cuisine." },
    };

    // Event delegation handles all finder buttons with one listener.
    filterSection.addEventListener("click", function (event) {
      if (!event.target.classList.contains("f-btn")) {
        return;
      }

      const cat = event.target.getAttribute("data-cat");
      const loader = document.getElementById("filterLoader");
      const result = document.getElementById("filterResult");
      if (!cat || !destData[cat] || !loader || !result) {
        return;
      }

      // Simulate a quick lookup/loading state.
      result.style.opacity = "0.3";
      loader.style.display = "block";

      setTimeout(function () {
        loader.style.display = "none";
        result.style.opacity = "1";

        // Replace result content with the selected destination recommendation.
        result.innerHTML = `
          <h4 style="margin:0; color:#0b1727;">${destData[cat].t}</h4>
          <p style="margin:0.25rem 0 0;">${destData[cat].d}</p>
        `;

        // Keep result visible for long pages.
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Reuse the demo status label when available.
        if (tipStatus) {
          tipStatus.textContent = "Found the perfect " + cat + " trip for you!";
        }
      }, 750);
    });
  }
})();
