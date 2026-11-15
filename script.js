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
    if (status.classList.contains("is-error")) setStatus("");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = input.value.trim();

    if (!EMAIL_RE.test(email)) {
      input.setAttribute("aria-invalid", "true");
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
