# DesignForm

A website design questionnaire for **Random Remi Designs**. Customers with no design or coding knowledge use it to describe the website they want, in as much or as little detail as they like.

## What's here

| File | What it is |
| --- | --- |
| `index.html` | The interactive form. It has a color wheel, theme previews (Light, Dark, Noir), layout sketches and a font preview, and it builds a downloadable summary of the answers. |
| `questionnaire.md` | The same questionnaire as a plain document, for printing or filling in by hand. |
| `form/` | The editable version of the form, split into `index.html` (content), `style.css` (looks) and `script.js` (behavior). Make changes here. |

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
- **Sending answers.** "Download my answers" saves a `.txt` summary, and "Copy my answers" puts it on the clipboard for pasting into an email.

## Putting it online with GitHub Pages

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, choose `main` and `/ (root)`, then click **Save**.
3. After a minute or two the form is live at `https://fauqur.github.io/designform/`. Send that link to customers.

## Changing it

The page is a single self-contained HTML file: styles and scripts are inline, and only fonts load from Google Fonts. Option lists (features, styles, glossary and so on) live near the top of the script in the `OPTS`, `STYLES` and `G` objects, so you can add or remove choices without touching the layout.
