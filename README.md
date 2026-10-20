# DesignForm

A website design questionnaire for **Random Remi Designs**. Customers with no design or coding knowledge use it to describe the website they want, in as much or as little detail as they like.

## What's here

| File | What it is |
| --- | --- |
| `form/` | The interactive form, split into `index.html` (content), `style.css` (looks) and `script.js` (behavior). Make changes here. |
| `questionnaire.md` | The same questionnaire as a plain document, for printing or filling in by hand. |
| `index.html` | A redirect, so the site's main address opens `form/`. |

### Where to change things in `form/`

- **Wording of questions and sections:** `index.html`. Each question is a `<div class="q" data-label="...">`.
- **Lists of choices** (features, feelings, styles, screen sizes, glossary and so on): the settings near the top of `script.js` (section 2).
- **Colors and fonts:** the variables at the top of `style.css` (section 1). Screen-size rules are grouped at the bottom, largest to smallest.

## How the form works

- **Every question is optional.** Each design section has a "Designer's choice" box so customers can hand that part over.
- **Two ways to answer.** "Exactly what I want" (fonts, colors, codes) and "Describe the feeling" (a mood or idea).
- **Extras are marked "+ fee".** The form lists every extra a customer picked at the top of their summary. No prices appear on the form; quote them separately.
- **One theme is included.** It can be light, dark or a custom style. Each extra theme adds a fee.
- **Screen sizes.** Laptop (1366px), tablet (768px) and phone (640px and under) are included. 1920px, extra-large, extra-small and up to 3 custom sizes add a fee.
- **Answers save as you go** in the customer's own browser (localStorage). Nothing is sent anywhere automatically.
- **Text boxes grow** with what's typed, so nothing is hidden behind a scrollbar on screen or on paper.
- **Saving a copy** (Send your answers panel):
  - **Save as PDF** opens the browser's print window. Customers choose "Save as PDF" as the printer. The printed copy is the whole form, always in light colors, with every answer shown in full and a line saying which theme the customer filled it out in. Print styles are in `style.css` section 23.
  - **Word (.docx)** is a clean document listing every question by section with its answer, or "n/a" if blank. It's built in the browser with no library (`script.js` section 13).
  - **Text (.txt)** is a short plain-text summary of the answers.
  - **Copy my answers** puts the text summary on the clipboard for pasting into an email.

## Putting it online with GitHub Pages

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, choose `main` and `/ (root)`, then click **Save**.
3. After a minute or two the form is live at `https://fauqur.github.io/designform/` (it opens `form/`). Send that link to customers.

## Changing it

Only fonts load from outside (Google Fonts), and no paid services are used. Choice lists live in the settings near the top of `form/script.js` (`OPTS`, `STYLES`, `GLOSSARY` and others), so you can add or remove choices without touching the layout.
