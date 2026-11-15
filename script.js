// Register-interest form. Posts the email as JSON to the URL in the form's
// data-endpoint attribute (a Formspree form works out of the box; any
// endpoint that accepts JSON POSTs and returns 2xx on success will do).

(function () {
  var form = document.getElementById("interest-form");
  var status = document.getElementById("form-status");
  var input = document.getElementById("email");
  var button = form.querySelector('button[type="submit"]');
  var endpoint = (form.getAttribute("data-endpoint") || "").trim();
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.getElementById("year").textContent = new Date().getFullYear();

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("is-error", !!isError);
  }

  function showSuccess() {
    var box = document.createElement("div");
    box.className = "form-success";
    box.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>' +
      "<span>You're on the list. We'll be in touch.</span>";
    form.replaceWith(box);
    setStatus("");
  }

  input.addEventListener("input", function () {
    input.removeAttribute("aria-invalid");
    form.classList.remove("is-invalid");
    if (status.classList.contains("is-error")) setStatus("");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = input.value.trim();

    if (!EMAIL_RE.test(email)) {
      input.setAttribute("aria-invalid", "true");
      form.classList.add("is-invalid");
      setStatus("Please enter a valid email address.", true);
      input.focus();
      return;
    }

    if (!endpoint) {
      setStatus("Sign-up isn't open yet. Please check back soon.", true);
      return;
    }

    button.disabled = true;
    button.textContent = "Submitting…";
    setStatus("");

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email: email,
        _gotcha: form.elements["_gotcha"].value,
        source: "attune-landing-page",
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showSuccess();
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = "Register interest";
        setStatus("Something went wrong. Please try again.", true);
      });
  });
})();

// Sticky nav: add a shadow once the page scrolls, and highlight the link
// for the section currently in view.
(function () {
  var header = document.querySelector(".site-header");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var targets = links.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });

  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    var offset = header.offsetHeight + 40;
    var current = -1;
    targets.forEach(function (el, i) {
      if (el && el.getBoundingClientRect().top - offset <= 0) current = i;
    });
    // "How it works" sits inside the solution section; past the last
    // target (the sign-up panel), clear the highlight.
    var register = document.getElementById("register");
    if (register && register.getBoundingClientRect().top - offset <= 0) current = -1;
    links.forEach(function (a, i) {
      a.classList.toggle("is-active", i === current);
      if (i === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

// Week chart: hover tooltip on each bar.
(function () {
  var chart = document.querySelector(".week-chart");
  if (!chart) return;
  var tip = chart.querySelector(".tooltip");

  Array.prototype.forEach.call(chart.querySelectorAll(".day"), function (day) {
    function show() {
      var bar = day.querySelector(".bar");
      var c = chart.getBoundingClientRect();
      var b = bar.getBoundingClientRect();
      tip.textContent = day.getAttribute("data-tip");
      var x = b.left + b.width / 2 - c.left;
      // Keep the tooltip inside the chart horizontally.
      var half = tip.offsetWidth / 2;
      x = Math.max(half, Math.min(c.width - half, x));
      tip.style.left = x + "px";
      tip.style.top = b.top - c.top - 30 + "px";
      tip.classList.add("is-visible");
    }
    function hide() {
      tip.classList.remove("is-visible");
    }
    day.addEventListener("mouseenter", show);
    day.addEventListener("mouseleave", hide);
    day.addEventListener("touchstart", show, { passive: true });
  });
  document.addEventListener("touchstart", function (e) {
    if (!chart.contains(e.target)) tip.classList.remove("is-visible");
  }, { passive: true });
})();
