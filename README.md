# Attune landing page

The pre-launch landing page for Attune, the AI training-plan and adaptive-nutrition app for runners and triathletes. It has four sections:

1. **The concept**: what Attune is, and the >90% of athletes who are amateurs
2. **The problem**: under-fuelling and RED-S risk, plus five pain points from athlete interviews
3. **The solution**: the three pillars (personalised, adaptive training plan, adaptive nutrition, a matched professional), a sample week chart and how it works
4. **Register your interest**: an email sign-up form

It's a static site (HTML, CSS and a little JavaScript) with no build step and no dependencies. Colours, type and the wordmark follow the Attune brand guidelines (September 2026).

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Set up the email form

The form sends each sign-up as a JSON `POST` to the URL in the form's `data-endpoint` attribute in `index.html`. Until you set it, the form shows "Sign-up isn't open yet".

With [Formspree](https://formspree.io), which is free for low volumes:

1. Create a form and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `index.html`, set `<form id="interest-form" ... data-endpoint="https://formspree.io/f/abcdwxyz">`.
3. Sign-ups then show up in the Formspree dashboard, and you can export them as CSV.

Any other service that accepts a JSON POST and returns a 2xx status also works, such as Basin, Getform or your own API. The request body is `{ email, _gotcha, source }`. `_gotcha` is a hidden honeypot field that Formspree uses to filter out bots.

## Deploy

The site is plain static files, so any static host works:

- **GitHub Pages**: go to Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel / Cloudflare Pages**: import the repo, with no build command and the output directory set to `/`.
