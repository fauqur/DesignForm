/* ==========================================================================
   Website Design Questionnaire — Random Remi Designs
   script.js

   Contents
    1. Helpers
    2. Settings you can edit (choices, styles, glossary, rows)
    3. Layout sketches
    4. Building the page (choices, labels, fixed rows)
    5. Repeating rows (custom themes, sections, forms, text blocks)
    6. Font previews
    7. Color studio and palette
    8. Designer's choice
    9. Reading answers and building the summary
   10. Progress and section index
   11. Saving drafts in the browser
   12. Send panel (download, copy, show, clear)
   13. Form theme switcher (Light / Dark / Noir)
   14. Start-up

   Loaded with "defer", so the page's HTML is ready when this runs.
   ========================================================================== */

(function () {
  "use strict";


  /* ------------------------------------------------------------------------
     1. Helpers
     ------------------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Escape text before putting it inside generated HTML
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const FEE_TAG = '<span class="tag fee">+ fee</span>';
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ------------------------------------------------------------------------
     2. Settings you can edit

     OPTS: the choices for every <div class="opts" data-opts="key"> in index.html.
       t      "checkbox" (pick many) or "radio" (pick one)
       fee    1 = every choice in the list is an extra (+ fee)
       items  each item is either "Label" or
              ["Label", "short description", "sketch name", feeFlag]
     ------------------------------------------------------------------------ */
  const OPTS = {
    purpose: { t: "checkbox", items: ["Sell products", "Show my work or portfolio", "Book clients or appointments", "Share information", "Collect sign-ups", "Build a community", "Something else"] },
    feel: { t: "checkbox", items: ["Calm", "Trustworthy", "Playful", "Luxurious", "Bold", "Cozy", "Mysterious", "Energetic", "Natural", "Professional", "Dreamy", "Edgy", "Warm", "Clean and simple"] },
    followDevice: { t: "radio", items: ["Yes", "No", "Designer's choice"] },
    remember: { t: "radio", items: ["Yes", "No", "Designer's choice"] },
    picStyle: { t: "checkbox", items: ["Real photos", "Drawings or illustrations", "Photos with people", "No people: places, products or objects", "Bright and colorful", "Soft and muted", "Black and white or vintage-toned"] },
    iconStyle: { t: "checkbox", items: [
      ["Outlined", "Thin lines", "ioutline"],
      ["Filled", "Solid shapes", "ifilled"],
      ["Hand-drawn", "Playful and sketchy", "ihand"],
      ["Colorful", "Uses your brand colors", "icolor"]
    ] },
    paidPics: { t: "checkbox", items: [
      ["Paid stock photos", "e.g. Adobe Stock, Shutterstock, Getty Images", "", 1],
      ["Pro icon sets", "e.g. Font Awesome Pro", "", 1],
      ["A professional photographer or custom photoshoot", "", "", 1],
      ["Custom illustrations drawn for me", "", "", 1],
      ["I agree to pay the license or service fees for the paid options I've ticked", "", "", 1]
    ] },
    logo: { t: "radio", items: [
      ["I have a logo as a digital file"],
      ["My logo is only on paper, a sign, a stamp or a product. Please turn it into a digital file", "", "", 1],
      ["I don't have a logo and would like one designed", "", "", 1],
      ["I don't need a logo, just my name in a nice font"]
    ] },
    menuPos: { t: "radio", items: [
      ["Across the top", "The classic menu bar along the top", "top"],
      ["Down the side", "Stays on the left or right; your pages show beside it", "side"],
      ["Hidden behind a button", "The ☰ button opens the menu, on every screen", "burger"]
    ] },
    menuScroll: { t: "radio", items: [
      ["Stays put", "Always visible while scrolling. Designers say “sticky”.", "sticky"],
      ["Scrolls away", "Moves off screen with the page. Designers say “static”.", "static"],
      ["Hides, then comes back", "Hides while scrolling down, returns when scrolling up", "hide"]
    ] },
    hero: { t: "checkbox", items: [
      ["One large picture with a headline", "", "hphoto"],
      ["Slideshow of pictures", "", "hslides"],
      ["Background video", "", "hvideo"],
      ["Bold headline, no picture", "", "htext"],
      ["Picture on one side, words on the other", "", "hsplit"]
    ] },
    footer: { t: "checkbox", items: ["Copyright line", "Social media links", "Address, phone or email", "Opening hours", "A small copy of the menu", "Newsletter sign-up", "Privacy policy and terms links"] },
    spacing: { t: "radio", items: [
      ["Airy and minimal", "Lots of empty space, few things at once", "airy"],
      ["Balanced", "Somewhere in the middle", "bal"],
      ["Full and busy", "Lots to look at", "busy"]
    ] },
    weight: { t: "radio", items: ["Mostly pictures", "An even mix", "Mostly words"] },
    // For buttons, the third value is the demo button's CSS modifiers (see style.css section 20)
    buttons: { t: "radio", items: [
      ["Square corners", "", "solid square"],
      ["Slightly rounded", "", "solid soft"],
      ["Fully rounded", "Pill-shaped", "solid pill"],
      ["Outlined", "Border only", "outline soft"],
      ["Solid", "Filled with color", "solid soft"]
    ] },
    motion: { t: "radio", items: [
      ["None", "Everything stays still"],
      ["Subtle", "Gentle fades and soft hover effects"],
      ["Lively", "Things slide, bounce or appear as you scroll"]
    ] },
    devices: { t: "radio", items: ["Mostly phones", "Mostly computers", "About even", "Not sure"] },
    pages: { t: "radio", items: [
      ["One long page", "Everything scrolls on one page; menu links jump to each part", "pone"],
      ["Separate pages", "Each part has its own page", "pmulti"],
      ["A mix", "One main page, plus separate pages for things like log in or contact", "pmix"]
    ] },
    features: { t: "checkbox", fee: 1, items: ["Online shop with payments", "Booking or appointment calendar", "Blog I can add posts to", "Photo or video gallery", "Newsletter or email sign-up", "Member login or private area", "Search box", "Social media feed", "Embedded map", "Embedded videos", "More than one language", "Live chat", "Downloads (PDF menus, guides)"] },
    wordsHelp: { t: "checkbox", items: [
      ["I'll send my text separately"],
      ["Please write the text for me", "", "", 1],
      ["Please polish my text: fix spelling and make it read smoothly", "", "", 1]
    ] },
    access: { t: "checkbox", items: ["Larger text, or a button to enlarge it", "Strong contrast between text and background", "An option to turn off movement", "Works well with screen readers", "Simple, plain-language layout"] },
    favicon: { t: "radio", items: ["Use my logo", "I'll supply one", "Designer's choice"] },
    share: { t: "radio", items: ["Use my logo", "Use a main photo from the site", "I'll supply one", "Designer's choice"] },
    updater: { t: "radio", items: [["Me"], ["The designer", "", "", 1], ["Not sure"]] },
    freq: { t: "radio", items: ["Rarely", "Monthly", "Weekly", "Daily"] },
    collect: { t: "radio", items: ["Yes", "No", "Not sure"] },
    legal: { t: "checkbox", items: ["Privacy policy", "Cookie notice", "Terms and conditions", "Returns or refund policy (for shops)", "I'll supply the wording", "Add placeholder pages; I'll get the wording myself"] },
    agree: { t: "checkbox", items: [
      "I understand that anything marked “+ fee” that I ticked or requested will be quoted separately, and I agree to those fees once I approve the quote.",
      "I understand that paid fonts, stock photos, icons and other licensed materials are charged at their own price, on top of design fees.",
      "I understand that the number of revision rounds (rounds of changes) included is listed in my quote, and extra rounds may cost more.",
      "I confirm that I own, or have permission to use, every logo, photo, text and other material I supply.",
      "Anything I left blank or marked “Designer's choice” is up to the designer."
    ] }
  };

  // Screen sizes: [id, label, width in px, extra fee?]
  const SIZES_INCLUDED = [
    ["z-1366", "Laptop: 1366px wide", 1366, false],
    ["z-768", "Tablet: 768px wide", 768, false],
    ["z-640", "Phone: 640px wide and smaller", 640, false]
  ];
  const SIZES_EXTRA = [
    ["z-1920", "Large desktop monitor: 1920px wide", 1920, true],
    ["z-xl", "Very large or ultra-wide: wider than 1920px", 1920, true],
    ["z-xs", "Very small: smaller than standard phones (e.g. watches)", 320, true]
  ];
  const SIZE_SCALE = 1920; // the width a full bar represents
  const CUSTOM_SIZE_COUNT = 3;

  // Custom theme styles and the one-line description shown when picked
  const STYLES = {
    "Noir": "Old detective film: period fonts, vintage-style pictures and icons, sepia or blue-tinted grayscale.",
    "Goth": "Dark and dramatic: deep blacks, crimson or purple, ornate lettering.",
    "Industrial": "Raw and mechanical: steel grays, rust, bold stencil-like type, metal textures.",
    "Hippie": "Free-spirited 60s and 70s: warm earthy and rainbow tones, rounded groovy lettering, flowers.",
    "Psychedelic": "Mind-bending: swirling saturated colors, melting shapes, wavy lettering.",
    "Fluffy": "Soft and cuddly: pastels, clouds, rounded fonts, puffy shapes.",
    "Cottagecore": "Countryside calm: florals, linen tones, handwritten touches.",
    "Retro 80s": "Neon, grids, chrome lettering and sunsets.",
    "Y2K": "Shiny 2000s: bubble letters, holographic and metallic colors.",
    "Cyberpunk": "Future city at night: neon on black, glitchy tech lettering.",
    "Art Deco": "1920s glamour: gold and black, geometric patterns, tall elegant lettering.",
    "Botanical": "Plants and nature: greens, leaf drawings, organic shapes.",
    "Coastal": "Beach house: sea blues, sand, white, airy and breezy.",
    "Minimal Zen": "Quiet and simple: lots of space, natural neutrals, gentle lines.",
    "Steampunk": "Victorian machines: brass, copper, gears, antique type.",
    "Vaporwave": "Dreamy 90s internet: pink and teal, statues, glitch effects.",
    "Something else": "Describe it in your own words below."
  };

  // Fixed rows
  const SECTIONS = ["Home / welcome", "About (your story, mission, team)", "Services or what you offer", "Prices", "Gallery or portfolio", "Shop / products", "Reviews from real customers", "Blog or news", "Events or calendar", "FAQ (common questions)", "Contact", "Log in / member area"];
  const ASSETS = ["Logo", "Photos (you, team, products, place)", "Artwork, drawings or patterns", "Videos", "Documents to link (menus, price lists)", "Other"];
  const FONT_ROLES = [
    ["Headings and titles", "e.g. Playfair Display"],
    ["Main reading text", "e.g. Roboto"],
    ["Accent: logo, quotes, buttons (optional)", "e.g. Pacifico"]
  ];
  const SOCIALS = ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "Other"];

  // Palette
  const PALETTE_MAX = 5;
  const COLOR_ROLES = ["Background", "Main text", "Buttons and links", "Headings", "Accents and highlights", "Designer's choice"];

  // Glossary rows: [everyday words, designer words, meaning]
  const GLOSSARY = [
    ["Menu bar, links, index, menu", "Navbar / navigation", "The area with links to the parts of your site or to other sites"],
    ["Three-line menu button", "Hamburger menu", "A ☰ button that opens a hidden menu, common on phones"],
    ["Menu that stays on screen", "Sticky or fixed navigation", "The menu stays visible while you scroll"],
    ["Menu that scrolls away", "Static navigation", "The menu moves off screen as you scroll"],
    ["Big picture at the top", "Hero", "The first large area visitors see"],
    ["Top of the page", "Header", "The strip at the very top, usually with your logo and menu"],
    ["Bottom of the page", "Footer", "The strip at the very bottom of every page"],
    ["Look, style, mode", "Theme", "A complete set of colors, fonts, pictures and icons"],
    ["Lettering style", "Font, typeface, font family", "A style of letters, including its bold and italic versions"],
    ["Color code", "Hex code", "A code like #C9431C that names one exact color"],
    ["Little symbols", "Icons", "Small pictures like a phone, envelope or shopping cart"],
    ["Works on phones", "Responsive design", "The site rearranges itself to fit any screen"],
    ["Screen width", "Breakpoint", "The screen size where the layout changes"],
    ["Website address", "Domain", "e.g. yourname.com"],
    ["Where the site lives online", "Hosting", "A company that keeps your site running on the internet"],
    ["Tab icon", "Favicon", "The tiny picture on a browser tab"],
    ["Link preview", "Social share image (OG image)", "The picture shown when someone shares your link"],
    ["Easy for everyone to use", "Accessibility", "Design that works for people with disabilities or different needs"],
    ["Movement, effects", "Animation, transitions", "Things that fade, slide or move on the page"],
    ["Mouse-over effect", "Hover state", "How a button or link changes when the pointer is over it"],
    ["Free to use", "Open source, royalty-free", "Fonts, images or icons you can use without paying (check each one's rules)"],
    ["Paid to use", "Licensed, premium, pro", "Materials you pay for the right to use"]
  ];

  // Browser storage keys
  const DRAFT_KEY = "rrd-website-questionnaire-v1";
  const THEME_KEY = "rrd-form-theme";


  /* ------------------------------------------------------------------------
     3. Layout sketches
     Each is SVG markup for a 120 x 80 wireframe. Shape classes (f, l, a, ...)
     are styled in style.css section 12.
     ------------------------------------------------------------------------ */
  const FRAME = '<rect class="f" x="2" y="2" width="116" height="76" rx="6"/>';
  const BODY3 = '<rect class="l" x="8" y="23" width="104" height="22" rx="2"/><rect class="l" x="8" y="50" width="49" height="22" rx="2"/><rect class="l" x="63" y="50" width="49" height="22" rx="2"/>';
  const LINES = '<rect class="l" x="8" y="23" width="96" height="9" rx="2"/><rect class="l" x="8" y="36" width="96" height="9" rx="2"/><rect class="l" x="8" y="49" width="96" height="9" rx="2"/><rect class="l" x="8" y="62" width="96" height="9" rx="2"/>';
  const ARROW_DOWN = '<path class="s" d="M111 28 v38 m-3.5 -4.5 l3.5 4.5 l3.5 -4.5"/>';
  const ARROW_UP = '<path class="s" d="M111 66 v-38 m-3.5 4.5 l3.5 -4.5 l3.5 4.5"/>';
  const TOP_STRIP = '<rect class="l" x="8" y="8" width="104" height="6" rx="2"/>';
  const BOTTOM_STRIP = '<rect class="l" x="8" y="64" width="104" height="8" rx="2"/>';
  const HERO_BOX = '<rect class="a" x="8" y="18" width="104" height="42" rx="3"/>';
  const HEART = "M60 64 C 32 47, 34 20, 51 22 C 55 22.5, 58.5 26, 60 30 C 61.5 26, 65 22.5, 69 22 C 86 20, 88 47, 60 64 Z";

  const busyGrid = () => {
    let out = '<rect class="l" x="6" y="6" width="108" height="6" rx="1"/>';
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        out += `<rect class="${(c + r) % 3 === 0 ? "a" : "l"}" x="${6 + c * 27.5}" y="${16 + r * 20.5}" width="24" height="17.5" rx="1"/>`;
      }
    }
    return out;
  };

  const SKETCHES = {
    // Menu position
    top: '<rect class="a" x="8" y="8" width="104" height="10" rx="2"/>' + BODY3,
    side: '<rect class="a" x="8" y="8" width="25" height="64" rx="2"/><rect class="l" x="38" y="8" width="74" height="28" rx="2"/><rect class="l" x="38" y="41" width="74" height="31" rx="2"/>',
    burger: '<rect class="l" x="8" y="8" width="104" height="10" rx="2"/><rect class="a" x="97" y="9.5" width="12" height="1.8"/><rect class="a" x="97" y="12.2" width="12" height="1.8"/><rect class="a" x="97" y="14.9" width="12" height="1.8"/>' + BODY3,
    // Menu scrolling
    sticky: '<rect class="a" x="8" y="8" width="104" height="10" rx="2"/>' + LINES + ARROW_DOWN,
    static: '<rect class="o" x="8" y="-5" width="104" height="10" rx="2"/><rect class="l" x="8" y="10" width="96" height="9" rx="2"/>' + LINES + ARROW_DOWN,
    hide: '<rect class="a-faint" x="8" y="8" width="104" height="10" rx="2"/>' + LINES + ARROW_UP,
    // Top banner
    hphoto: TOP_STRIP + HERO_BOX + '<rect class="w" x="30" y="32" width="60" height="6" rx="2"/><rect class="w" x="42" y="42" width="36" height="4" rx="2"/>' + BOTTOM_STRIP,
    hslides: TOP_STRIP + HERO_BOX + '<path class="s s-light" d="M16 34 l-4 5 l4 5 M104 34 l4 5 l-4 5"/><circle class="w" cx="52" cy="53" r="2.2"/><circle class="w-faint" cx="60" cy="53" r="2.2"/><circle class="w-faint" cx="68" cy="53" r="2.2"/>' + BOTTOM_STRIP,
    hvideo: TOP_STRIP + HERO_BOX + '<circle class="w" cx="60" cy="39" r="10"/><path class="a" d="M57 33.5 L66 39 L57 44.5 Z"/>' + BOTTOM_STRIP,
    htext: TOP_STRIP + '<rect class="k" x="18" y="26" width="84" height="9" rx="2"/><rect class="l" x="30" y="39" width="60" height="6" rx="2"/><rect class="a" x="46" y="50" width="28" height="9" rx="3"/>' + BOTTOM_STRIP,
    hsplit: TOP_STRIP + '<rect class="a" x="8" y="18" width="50" height="42" rx="3"/><rect class="k" x="64" y="26" width="46" height="7" rx="2"/><rect class="l" x="64" y="37" width="44" height="4" rx="2"/><rect class="l" x="64" y="44" width="38" height="4" rx="2"/><rect class="a-faint" x="64" y="51" width="22" height="7" rx="2"/>' + BOTTOM_STRIP,
    // Pages
    pone: '<rect class="pg" x="38" y="6" width="44" height="68" rx="3"/><rect class="a" x="41" y="9" width="38" height="5" rx="1"/><rect class="l" x="41" y="17" width="38" height="12" rx="1"/><rect class="l" x="41" y="32" width="38" height="12" rx="1"/><rect class="l" x="41" y="47" width="38" height="12" rx="1"/><rect class="l" x="41" y="62" width="38" height="9" rx="1"/><path class="s" d="M88 12 c10 0 10 26 0 26 m3 -3 l-3 3 l3 3"/>',
    pmulti: [8, 45, 82].map((x) => `<rect class="pg" x="${x}" y="20" width="31" height="42" rx="3"/><rect class="a" x="${x + 3}" y="23" width="25" height="4"/><rect class="l" x="${x + 3}" y="31" width="25" height="27"/>`).join(""),
    pmix: '<rect class="pg" x="10" y="6" width="40" height="68" rx="3"/><rect class="a" x="13" y="9" width="34" height="5"/><rect class="l" x="13" y="17" width="34" height="14"/><rect class="l" x="13" y="34" width="34" height="14"/><rect class="l" x="13" y="51" width="34" height="20"/>' +
      [60, 89].map((x) => `<rect class="pg" x="${x}" y="22" width="24" height="34" rx="3"/><rect class="a" x="${x + 2}" y="25" width="20" height="3"/><rect class="l" x="${x + 2}" y="31" width="20" height="22"/>`).join(""),
    // Spacing
    airy: '<rect class="l" x="8" y="8" width="104" height="5" rx="2"/><rect class="k" x="38" y="28" width="44" height="6" rx="2"/><rect class="l" x="46" y="39" width="28" height="4" rx="2"/><rect class="a" x="52" y="52" width="16" height="6" rx="2"/>',
    bal: '<rect class="l" x="8" y="8" width="104" height="6" rx="2"/><rect class="k" x="8" y="20" width="60" height="6" rx="2"/><rect class="l" x="8" y="30" width="50" height="4" rx="2"/><rect class="a" x="74" y="20" width="38" height="26" rx="2"/><rect class="l" x="8" y="52" width="32" height="20" rx="2"/><rect class="l" x="44" y="52" width="32" height="20" rx="2"/><rect class="l" x="80" y="52" width="32" height="20" rx="2"/>',
    busy: busyGrid(),
    // Icon styles
    ioutline: `<path class="ic" d="${HEART}"/>`,
    ifilled: `<path class="ic-fill" d="${HEART}"/>`,
    ihand: `<path class="ic ic-hand" transform="rotate(-6 60 42)" d="${HEART}"/><path class="ic ic-ghost" transform="rotate(4 60 42) translate(1.5 1)" d="${HEART}"/>`,
    icolor: `<path class="a" d="${HEART}"/><circle class="w-faint" cx="50" cy="31" r="4"/>`
  };

  const sketch = (key) => `<svg class="sk" viewBox="0 0 120 80" aria-hidden="true">${FRAME}${SKETCHES[key] || ""}</svg>`;


  /* ------------------------------------------------------------------------
     4. Building the page
     ------------------------------------------------------------------------ */

  // Turn an OPTS item into {label, desc, extra, fee}
  function normalizeItem(item) {
    if (Array.isArray(item)) return { v: item[0], d: item[1] || "", extra: item[2] || "", fee: !!item[3] };
    return { v: item, d: "", extra: "", fee: false };
  }

  function renderChoices() {
    $$("[data-opts]").forEach((box) => {
      const key = box.dataset.opts;
      const set = OPTS[key];
      if (!set) return;

      const isCards = box.classList.contains("cards");
      const isList = box.classList.contains("list");

      box.innerHTML = set.items.map((raw, i) => {
        const it = normalizeItem(raw);
        const fee = it.fee || !!set.fee;
        const input = `<input type="${set.t}" id="${key}-${i}" name="${key}" value="${esc(it.v)}"${fee ? ' data-fee="1"' : ""}>`;
        const classes = ["opt", set.t === "radio" && "radio", isCards && "card", isList && "line"].filter(Boolean).join(" ");

        if (isCards) {
          let picture = it.extra ? sketch(it.extra) : "";
          if (key === "buttons") {
            const mods = it.extra.split(" ").map((m) => `bdemo--${m}`).join(" ");
            picture = `<span class="bdemo ${mods}">Book now</span>`;
          }
          return `<label class="${classes}">${input}${picture}<span class="ot"><span class="tick"></span>${esc(it.v)}</span>${it.d ? `<small>${esc(it.d)}</small>` : ""}${fee ? FEE_TAG : ""}</label>`;
        }

        const desc = it.d ? ` <span class="term">(${esc(it.d)})</span>` : "";
        return `<label class="${classes}">${input}<span class="tick"></span><span>${esc(it.v)}${desc}${fee ? " " + FEE_TAG : ""}</span></label>`;
      }).join("");
    });
  }

  // Add the visible label (and hint) to every question from data-label / data-hint
  function renderLabels() {
    $$(".q[data-label]").forEach((q) => {
      const first = q.firstElementChild;
      const isSingleField = q.children.length === 1 && first && /^(INPUT|TEXTAREA|SELECT)$/.test(first.tagName);

      const label = document.createElement(isSingleField ? "label" : "div");
      label.className = "qlabel";
      if (isSingleField) label.htmlFor = first.id;
      label.textContent = q.dataset.label;
      q.prepend(label);

      if (q.dataset.hint) {
        const hint = document.createElement("div");
        hint.className = "qhint";
        hint.textContent = q.dataset.hint;
        label.after(hint);
      }
    });
  }

  const WHERE_OPTIONS = '<option value="">Where it lives…</option><option>Part of the main page</option><option>Its own page</option><option>Designer\'s choice</option>';

  function renderFixedRows() {
    // Sections the site could have. The checkbox (class "need") decides if the row counts.
    $("#secs").innerHTML = SECTIONS.map((s, i) => `
      <div class="row r-sec">
        <label class="chk"><input type="checkbox" class="need" id="sec-${i}" value="${esc(s)}">${esc(s)}</label>
        <select id="sec-${i}-w" data-sub="Where" aria-label="Where ${esc(s)} lives">${WHERE_OPTIONS}</select>
        <input type="text" id="sec-${i}-n" data-sub="Notes" placeholder="Notes" aria-label="Notes for ${esc(s)}">
        <span></span>
      </div>`).join("");

    // Logo and materials
    $("#assets").innerHTML = ASSETS.map((a, i) => `
      <div class="row r-asset" data-name="${esc(a)}">
        <span class="rname">${esc(a)}</span>
        <select id="as-${i}-k" data-sub="Format" aria-label="${esc(a)}: digital or physical">
          <option value="">Choose…</option><option>Digital file</option><option>Physical item to digitize</option><option>Both</option><option>Don't have this</option>
        </select>
        <input type="text" id="as-${i}-t" data-sub="File type" placeholder="JPG, PNG, PDF…" aria-label="${esc(a)}: file type">
        <input type="text" id="as-${i}-n" data-sub="Notes" placeholder="Where it goes, colors to keep" aria-label="${esc(a)}: notes">
      </div>`).join("");

    // Fonts
    $("#fonts").innerHTML = FONT_ROLES.map(([role, example], i) => `
      <div class="row r-font" data-name="${esc(role)}">
        <span class="rname">${esc(role)}</span>
        <input type="text" id="fo-${i}-n" data-sub="Font" placeholder="${esc(example)}" aria-label="${esc(role)}: font name">
        <select id="fo-${i}-p" data-sub="Type" aria-label="${esc(role)}: free or paid">
          <option value="">Free or paid?</option><option>Free</option><option>Paid</option><option>Not sure</option>
        </select>
        <input type="text" id="fo-${i}-d" data-sub="Described as" placeholder="handwritten, typewriter, bold and modern…" aria-label="${esc(role)}: describe it">
        <p class="fprev" id="fp-${i}" hidden><small>Preview</small><span></span></p>
      </div>`).join("");

    // Social links
    $("#socials").innerHTML = SOCIALS.map((s, i) => `
      <div class="row r-social" data-name="${s}">
        <span class="rname">${s}</span>
        <input type="text" id="so-${i}" placeholder="Link or @name" aria-label="${s} link">
      </div>`).join("");

    // Custom screen sizes (width × height)
    let custom = "";
    for (let n = 1; n <= CUSTOM_SIZE_COUNT; n++) {
      custom += `
      <div class="row r-size" data-name="Custom size ${n}" data-fmt="size" data-fee="1">
        <span class="rname">Size ${n}</span>
        <input type="number" min="1" id="cs-${n}-w" data-sub="Width" placeholder="____" aria-label="Custom size ${n} width in pixels">
        <span class="x">×</span>
        <input type="number" min="1" id="cs-${n}-h" data-sub="Height" placeholder="____" aria-label="Custom size ${n} height in pixels">
        <input type="text" class="wide" id="cs-${n}-s" data-sub="Screen" placeholder="What screen is this?" aria-label="Custom size ${n}: what screen">
      </div>`;
    }
    $("#customsizes").innerHTML = custom + `<div>${FEE_TAG}</div>`;

    // Standard screen sizes with proportional bars
    const sizeRow = ([id, label, px, fee]) => `
      <div class="size">
        <label class="opt"><input type="checkbox" id="${id}" value="${esc(label)}"${fee ? ' data-fee="1"' : ""}><span class="tick"></span><span>${esc(label)}${fee ? " " + FEE_TAG : ""}</span></label>
        <span class="bar" aria-hidden="true"><i data-px="${px}"></i></span>
      </div>`;
    $("#sizes-inc").innerHTML = SIZES_INCLUDED.map(sizeRow).join("");
    $("#sizes-extra").innerHTML = SIZES_EXTRA.map(sizeRow).join("");
    $$(".size .bar i").forEach((bar) => {
      bar.style.width = Math.min(100, (bar.dataset.px / SIZE_SCALE) * 100) + "%";
    });

    // Glossary
    $("#gloss-body").innerHTML = GLOSSARY.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
  }


  /* ------------------------------------------------------------------------
     5. Repeating rows
     Each kind has a template, a container and a limit. Rows carry
     data-kind and data-i so drafts can rebuild them.
     ------------------------------------------------------------------------ */
  const ROW_KINDS = {
    theme: { host: "#themes", button: "#add-theme", limit: 8 },
    sec: { host: "#secs", button: "#add-sec", limit: 20 },
    form: { host: "#forms", button: "#add-form", limit: 6 },
    words: { host: "#words", button: "#add-words", limit: 30 }
  };
  const nextIndex = { theme: 0, sec: 0, form: 0, words: 0 };

  const TEMPLATES = {
    theme: (i) => `
      <div class="row block" data-kind="theme" data-i="${i}" data-name="Custom theme">
        <div class="block-head"><b class="rt">Custom theme</b><button type="button" class="link rm">Remove</button></div>
        <div class="grid">
          <label class="f"><span>Style</span>
            <select id="th-${i}-s" data-sub="Style" class="style-pick">
              <option value="">Choose a style…</option>${Object.keys(STYLES).map((s) => `<option>${s}</option>`).join("")}
            </select>
          </label>
          <label class="f"><span>Your name for it, or the style in your words</span><input type="text" id="th-${i}-n" data-sub="Name"></label>
        </div>
        <p class="style-hint"></p>
        <div class="pair">
          <label class="f"><span>Exactly what I want (fonts, colors, icons, pictures)</span><textarea id="th-${i}-e" data-sub="Exactly" rows="3"></textarea></label>
          <label class="f"><span>Describe the feeling</span><textarea id="th-${i}-f" data-sub="Feeling" rows="3"></textarea></label>
        </div>
      </div>`,

    sec: (i) => `
      <div class="row r-sec" data-kind="sec" data-i="${i}" data-name="Added section">
        <input type="text" id="sx-${i}-n" data-sub="Section" placeholder="Section name" aria-label="Section name">
        <select id="sx-${i}-w" data-sub="Where" aria-label="Where it lives">${WHERE_OPTIONS}</select>
        <input type="text" id="sx-${i}-o" data-sub="Notes" placeholder="Notes" aria-label="Notes">
        <button type="button" class="link rm">Remove</button>
      </div>`,

    form: (i) => `
      <div class="row r-form" data-kind="form" data-i="${i}" data-name="Form">
        <input type="text" id="fm-${i}-t" data-sub="Type" placeholder="Contact, booking, quote…" aria-label="Form type">
        <input type="text" id="fm-${i}-f" data-sub="Asks for" placeholder="Name, email, message…" aria-label="Boxes it asks for">
        <input type="text" id="fm-${i}-to" data-sub="Send to" placeholder="Email address" aria-label="Send answers to">
        <input type="text" id="fm-${i}-m" data-sub="After sending" placeholder="Thanks! We'll reply within a day." aria-label="Message after sending">
        <button type="button" class="link rm">Remove</button>
      </div>`,

    words: (i) => `
      <div class="row block" data-kind="words" data-i="${i}" data-name="Text">
        <div class="block-head">
          <label class="f f--grow"><span>Section name</span><input type="text" id="wd-${i}-n" data-sub="Section" placeholder="e.g. About, Mission, Services"></label>
          <button type="button" class="link rm">Remove</button>
        </div>
        <label class="f"><span>Exact text</span><textarea class="big" id="wd-${i}-t" data-sub="Text" placeholder="Paste or type your words here, exactly as they should appear."></textarea></label>
      </div>`
  };

  function addRow(kind, i) {
    if (i === undefined) i = nextIndex[kind];
    nextIndex[kind] = Math.max(nextIndex[kind], i + 1);
    $(ROW_KINDS[kind].host).insertAdjacentHTML("beforeend", TEMPLATES[kind](i));
    renumberThemes();
    updateRowLimits();
    return $(`${ROW_KINDS[kind].host} .row[data-kind="${kind}"][data-i="${i}"]`);
  }

  function renumberThemes() {
    $$("#themes .row").forEach((row, n) => {
      $(".rt", row).textContent = `Custom theme ${n + 1}`;
    });
  }

  function updateRowLimits() {
    Object.entries(ROW_KINDS).forEach(([kind, cfg]) => {
      $(cfg.button).disabled = $$(`${cfg.host} .row[data-kind="${kind}"]`).length >= cfg.limit;
    });
  }

  function bindRows() {
    $("#add-theme").addEventListener("click", () => {
      const row = addRow("theme");
      $("#th-custom").checked = true;
      $("select", row).focus();
      onChange();
    });
    $("#add-sec").addEventListener("click", () => { $("input", addRow("sec")).focus(); onChange(); });
    $("#add-form").addEventListener("click", () => { $("input", addRow("form")).focus(); onChange(); });
    $("#add-words").addEventListener("click", () => { $("input", addRow("words")).focus(); onChange(); });

    // Remove buttons on any repeating row
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".rm");
      if (!btn) return;
      btn.closest(".row").remove();
      renumberThemes();
      updateRowLimits();
      onChange();
    });

    // Show the description of a picked custom style
    document.addEventListener("change", (e) => {
      if (e.target.classList.contains("style-pick")) {
        $(".style-hint", e.target.closest(".row")).textContent = STYLES[e.target.value] || "";
      }
    });

    // Typing details into a section row ticks that section
    $("#secs").addEventListener("input", (e) => {
      const row = e.target.closest(".row");
      const need = row && $("input.need", row);
      if (need && e.target !== need && e.target.value) need.checked = true;
    });
  }


  /* ------------------------------------------------------------------------
     6. Font previews (loads the typed name from Google Fonts)
     ------------------------------------------------------------------------ */
  const loadedFonts = new Set();
  const fontTimers = {};

  function previewFont(i) {
    const name = $(`#fo-${i}-n`).value.trim();
    const box = $(`#fp-${i}`);
    if (!name) { box.hidden = true; return; }

    if (!loadedFonts.has(name)) {
      loadedFonts.add(name);
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(name).replace(/%20/g, "+") + "&display=swap";
      document.head.appendChild(link);
    }

    const sample = $("span", box);
    const business = $("#a-biz").value.trim() || "Your Business Name";
    sample.textContent = `${business}: the quick brown fox jumps over the lazy dog`;
    sample.style.fontFamily = `"${name.replace(/"/g, "")}", system-ui, sans-serif`;
    $("small", box).textContent = `Preview of “${name}” (works for Google Fonts names)`;
    box.hidden = false;
  }

  function bindFonts() {
    $("#fonts").addEventListener("input", (e) => {
      const match = e.target.id.match(/^fo-(\d)-n$/);
      if (!match) return;
      clearTimeout(fontTimers[match[1]]);
      fontTimers[match[1]] = setTimeout(() => previewFont(match[1]), 500);
    });
  }


  /* ------------------------------------------------------------------------
     7. Color studio and palette
     ------------------------------------------------------------------------ */

  // Color math
  const hsvToRgb = (h, s, v) => {
    const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
    return [f(5), f(3), f(1)].map((x) => Math.round(x * 255));
  };
  const rgbToHex = (rgb) => "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
  const hexToRgb = (hex) => {
    let h = String(hex || "").trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  const rgbToHsv = ([r, g, b]) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return [h, max ? d / max : 0, max];
  };

  // Plain-English name for a color, e.g. "Dark orange"
  function colorName(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return "";
    const [h, s, v] = rgbToHsv(rgb);
    if (v < .13) return "Black";
    if (s < .1) return v > .93 ? "White" : v > .65 ? "Light gray" : v > .38 ? "Gray" : "Charcoal";

    const hues = [[12, "red"], [40, "orange"], [66, "yellow"], [95, "lime green"], [155, "green"], [185, "teal"], [205, "sky blue"], [245, "blue"], [270, "indigo"], [295, "purple"], [325, "magenta"], [348, "pink"], [361, "red"]];
    let name = hues.find((t) => h < t[0])[1];
    if (name === "orange" && v < .62) name = "brown";
    if (name === "yellow" && v < .6) name = "olive";

    const prefix = v < .42 ? "dark " : (s < .3 && v > .8) ? "pale " : s < .45 ? "muted " : (v > .85 && s > .75) ? "bright " : "";
    const out = prefix + name;
    return out[0].toUpperCase() + out.slice(1);
  }

  // Current pick (hue 0–360, saturation 0–1, brightness 0–1)
  let H = 14, S = .86, V = .79;
  const wheel = $("#wheel");
  const ctx = wheel.getContext("2d");
  const marker = $("#wheel-marker");
  const currentHex = () => rgbToHex(hsvToRgb(H, S, V));

  function drawWheel() {
    const cssSize = wheel.clientWidth || 230;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const n = Math.round(cssSize * dpr);
    if (wheel.width !== n) { wheel.width = n; wheel.height = n; }

    const r = n / 2;
    const img = ctx.createImageData(n, n);
    const d = img.data;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const dx = x - r + .5, dy = y - r + .5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r + 1) continue;
        const hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
        const c = hsvToRgb(hue, Math.min(dist / r, 1), V);
        const o = (y * n + x) * 4;
        d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2];
        d[o + 3] = Math.round(Math.max(0, Math.min(1, r - dist + .5)) * 255); // soft edge
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  let wheelFrame = 0;
  const redrawWheel = () => { cancelAnimationFrame(wheelFrame); wheelFrame = requestAnimationFrame(drawWheel); };

  function showPick(keepTyped) {
    const hex = currentHex();
    const radius = (wheel.clientWidth || 230) / 2;
    const angle = H * Math.PI / 180;

    marker.style.left = (radius + Math.cos(angle) * S * radius) + "px";
    marker.style.top = (radius + Math.sin(angle) * S * radius) + "px";
    marker.style.background = hex;

    $("#now-swatch").style.background = hex;
    $("#now-hex").textContent = hex;
    $("#now-name").textContent = colorName(hex);
    if (!keepTyped) $("#typed").value = hex;
    $("#native").value = hex.toLowerCase();
    $("#bright").value = Math.round(V * 100);

    // Suggestions that go with the current color
    const shift = (dh, dv = 0) => rgbToHex(hsvToRgb((H + dh + 360) % 360, S, Math.max(.05, Math.min(1, V + dv))));
    const groups = [
      ["Opposite (stands out)", [shift(180)]],
      ["Neighbors (calm together)", [shift(-30), shift(30)]],
      ["Three-way balance", [shift(120), shift(240)]],
      ["Lighter and darker", [shift(0, .25), shift(0, -.3)]]
    ];
    $("#harm").innerHTML = '<div class="mini-lbl">Colors that go with it. Click one to add it.</div>' +
      groups.map(([title, colors]) => `<div class="harm-row"><span>${title}</span>${colors.map((c) => `<button type="button" class="hchip" data-hex="${c}"><i></i>${c}</button>`).join("")}</div>`).join("");
    $$("#harm .hchip").forEach((chip) => { $("i", chip).style.background = chip.dataset.hex; });
  }

  function pickAt(e) {
    const box = wheel.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    H = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    S = Math.min(Math.sqrt(x * x + y * y) / (box.width / 2), 1);
    showPick();
  }

  function setFromHex(hex, keepTyped) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    [H, S, V] = rgbToHsv(rgb);
    redrawWheel();
    showPick(keepTyped);
  }

  // Palette
  let palette = [];

  function addColor(hex) {
    if (palette.length >= PALETTE_MAX) {
      $("#pal-count").textContent = `Your palette is full (${PALETTE_MAX} colors). Remove one to add another.`;
      return;
    }
    palette.push({ hex, name: colorName(hex), role: "" });
    renderPalette();
    onChange();
  }

  function renderPalette() {
    $("#palette").innerHTML = palette.map((c, i) => `
      <div class="row r-pal" data-name="Color ${i + 1}" data-pi="${i}">
        <input type="color" id="pc-${i}" value="${c.hex.toLowerCase()}" aria-label="Color ${i + 1}" data-nosave>
        <input type="text" class="hex" id="ph-${i}" data-sub="Code" value="${esc(c.hex)}" maxlength="7" aria-label="Color ${i + 1} code" data-nosave>
        <input type="text" class="wide" id="pn-${i}" data-sub="Name" value="${esc(c.name)}" placeholder="Name it" aria-label="Color ${i + 1} name" data-nosave>
        <select class="wide" id="pr-${i}" data-sub="Use for" aria-label="Where color ${i + 1} goes" data-nosave>
          <option value="">Where should it go?</option>${COLOR_ROLES.map((r) => `<option${r === c.role ? " selected" : ""}>${r}</option>`).join("")}
        </select>
        <button type="button" class="link prm">Remove</button>
      </div>`).join("");

    const strip = $("#strip");
    if (palette.length) {
      strip.classList.remove("empty");
      strip.innerHTML = palette.map(() => "<i></i>").join("");
      paintStrip();
    } else {
      strip.classList.add("empty");
      strip.textContent = "Your colors will appear here";
    }

    $("#pal-count").textContent = palette.length ? `${palette.length} of ${PALETTE_MAX} colors chosen` : `Pick 3 to ${PALETTE_MAX} colors`;
    $("#add-color").disabled = palette.length >= PALETTE_MAX;
  }

  function paintStrip() {
    $$("#strip i").forEach((el, i) => { el.style.background = palette[i].hex; });
  }

  function bindColors() {
    let dragging = false;
    wheel.addEventListener("pointerdown", (e) => { dragging = true; wheel.setPointerCapture(e.pointerId); pickAt(e); });
    wheel.addEventListener("pointermove", (e) => { if (dragging) pickAt(e); });
    wheel.addEventListener("pointerup", () => { dragging = false; });

    $("#bright").addEventListener("input", (e) => { V = e.target.value / 100; redrawWheel(); showPick(); });
    $("#typed").addEventListener("input", (e) => {
      const v = e.target.value.trim();
      if (/^#?[0-9a-f]{6}$/i.test(v)) setFromHex(v, true);
    });
    $("#native").addEventListener("input", (e) => setFromHex(e.target.value));
    $("#harm").addEventListener("click", (e) => {
      const chip = e.target.closest(".hchip");
      if (chip) addColor(chip.dataset.hex);
    });
    $("#add-color").addEventListener("click", () => addColor(currentHex()));

    // Editing a palette row
    $("#palette").addEventListener("input", (e) => {
      const row = e.target.closest(".row");
      if (!row) return;
      const c = palette[+row.dataset.pi];

      if (e.target.type === "color") {
        c.hex = e.target.value.toUpperCase();
        $(".hex", row).value = c.hex;
      } else if (e.target.classList.contains("hex")) {
        const rgb = hexToRgb(e.target.value);
        if (rgb) { c.hex = rgbToHex(rgb); $('input[type="color"]', row).value = c.hex.toLowerCase(); }
      } else if (e.target.tagName === "SELECT") {
        c.role = e.target.value;
      } else {
        c.name = e.target.value;
      }
      paintStrip();
    });
    $("#palette").addEventListener("change", (e) => {
      if (e.target.tagName === "SELECT") {
        palette[+e.target.closest(".row").dataset.pi].role = e.target.value;
        onChange();
      }
    });
    $("#palette").addEventListener("click", (e) => {
      if (!e.target.classList.contains("prm")) return;
      palette.splice(+e.target.closest(".row").dataset.pi, 1);
      renderPalette();
      onChange();
    });
  }


  /* ------------------------------------------------------------------------
     8. Designer's choice: fade a section that's been handed over
     ------------------------------------------------------------------------ */
  function syncDesignerChoice() {
    $$(".dc-box").forEach((box) => box.closest("section").classList.toggle("handed", box.checked));
  }


  /* ------------------------------------------------------------------------
     9. Reading answers and building the summary
     ------------------------------------------------------------------------ */

  // The answer held by one field, or "" if empty / not ticked
  function valueOf(el) {
    if (el.type === "checkbox" || el.type === "radio") return el.checked ? el.value : "";
    if (el.type === "color" || el.type === "button" || el.type === "range") return "";
    return (el.value || "").trim();
  }

  const fieldsIn = (root) => $$("input, select, textarea", root);

  // One line for a row, e.g. "Logo | Format: Digital file | Notes: ..."
  function readRow(row) {
    const need = $("input.need", row);
    if (need && !need.checked) return null;

    if (row.dataset.fmt === "size") {
      const w = valueOf($('[data-sub="Width"]', row));
      const h = valueOf($('[data-sub="Height"]', row));
      const s = valueOf($('[data-sub="Screen"]', row));
      if (!w && !h && !s) return null;
      return `${row.dataset.name}: ${w || "?"} × ${h || "?"} px${s ? " | " + s : ""}`;
    }

    if (row.dataset.kind === "words") {
      const name = valueOf($('[data-sub="Section"]', row));
      const text = valueOf($('[data-sub="Text"]', row));
      if (!name && !text) return null;
      return `${name || "Untitled section"}:\n${text || "(no text yet)"}\n`;
    }

    const parts = [];
    fieldsIn(row).forEach((el) => {
      if (el === need) return;
      const v = valueOf(el);
      if (v) parts.push(el.dataset.sub ? `${el.dataset.sub}: ${v}` : v);
    });
    if (!parts.length && !need) return null;

    const name = need ? need.value : (row.dataset.name || "");
    return [name, ...parts].filter(Boolean).join(" | ");
  }

  // All answers for one question, as lines
  function readQuestion(q) {
    const out = [];
    const loose = fieldsIn(q).filter((el) => !el.closest(".row"));

    const picks = loose.filter((el) => (el.type === "checkbox" || el.type === "radio") && el.checked).map((el) => el.value);
    if (picks.length) out.push(picks.join(", "));

    $$(".row", q).forEach((row) => {
      const line = readRow(row);
      if (line) out.push(line);
    });

    loose
      .filter((el) => !["checkbox", "radio", "color", "button", "range"].includes(el.type))
      .forEach((el) => {
        const v = valueOf(el);
        if (v) out.push(el.dataset.sub ? `${el.dataset.sub}: ${v}` : v);
      });

    return out;
  }

  // How many themes were chosen (the first one is included)
  function themeCount() {
    const customRows = $$("#themes .row").length;
    return ($("#th-light").checked ? 1 : 0) +
      ($("#th-dark").checked ? 1 : 0) +
      (customRows || ($("#th-custom").checked ? 1 : 0));
  }

  // Everything the customer picked that carries an extra fee
  function feeItems() {
    const items = [];
    $$("#form input[data-fee]").forEach((el) => { if (el.checked) items.push(el.value); });
    $$("#form .row[data-fee]").forEach((row) => {
      const line = readRow(row);
      if (line) items.push(line);
    });
    const extraThemes = themeCount() - 1;
    if (extraThemes > 0) items.push(`Extra theme${extraThemes > 1 ? "s" : ""} beyond the included one: ${extraThemes}`);
    return items;
  }

  const indent = (s) => "    " + s.replace(/\n/g, "\n    ");

  // Plain-text summary used for Show, Copy and Download
  function buildSummary() {
    const lines = [];
    const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    lines.push("WEBSITE DESIGN QUESTIONNAIRE", "Random Remi Designs", "Prepared " + today, "");

    const fees = feeItems();
    if (fees.length) {
      lines.push("ADD-ONS REQUESTED (additional fee, quoted separately)", "-".repeat(52));
      fees.forEach((f) => lines.push("• " + f));
      lines.push("");
    }

    $$("#form section.sec").forEach((sec) => {
      const title = sec.dataset.title;
      const body = [];

      const dc = $(".dc-box", sec);
      if (dc && dc.checked) body.push("[Designer's choice: the designer decides this section]");

      $$(".q", sec).forEach((q) => {
        const answers = readQuestion(q);
        if (!answers.length) return;
        if (answers.length === 1 && !answers[0].includes("\n") && answers[0].length < 90) {
          body.push(`• ${q.dataset.label}: ${answers[0]}`);
        } else {
          body.push(`• ${q.dataset.label}:`);
          answers.forEach((a) => body.push(indent(a)));
        }
      });

      // Stand-alone checkboxes that sit outside a question
      $$(".sec-body > .opts input:checked", sec).forEach((el) => body.push("• " + el.value));

      lines.push(title.toUpperCase(), "-".repeat(Math.min(52, title.length)));
      lines.push(...(body.length ? body : ["(left blank)"]), "");
    });

    return lines.join("\n");
  }


  /* ------------------------------------------------------------------------
     10. Progress and section index
     ------------------------------------------------------------------------ */
  function isAnswered(section) {
    const dc = $(".dc-box", section);
    if (dc && dc.checked) return true;
    return fieldsIn(section).some((el) => !el.classList.contains("dc-box") && !el.closest(".studio") && valueOf(el));
  }

  function buildIndex() {
    const toc = $("#toc");
    $$("#form section.sec").forEach((sec) => {
      const a = document.createElement("a");
      a.href = "#" + sec.id;
      a.dataset.for = sec.id;
      a.innerHTML = `<span class="dot"></span>${esc(sec.dataset.title)}`;
      toc.appendChild(a);
    });

    const sendLink = document.createElement("a");
    sendLink.href = "#send";
    sendLink.innerHTML = '<span class="dot"></span>Send your answers';
    toc.appendChild(sendLink);

    toc.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      e.preventDefault();
      $(a.getAttribute("href")).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  function updateProgress() {
    const sections = $$("#form section.sec");
    let done = 0;
    sections.forEach((sec) => {
      const answered = isAnswered(sec);
      if (answered) done++;
      const link = $(`#toc a[data-for="${sec.id}"]`);
      if (link) link.classList.toggle("done", answered);
    });
    $("#prog").textContent = `${done} of ${sections.length} sections answered`;
    $("#prog-bar").style.width = (done / sections.length * 100) + "%";

    const themes = themeCount();
    $("#th-count").textContent = themes
      ? `${themes} theme${themes > 1 ? "s" : ""} chosen: 1 included${themes > 1 ? `, ${themes - 1} extra (+ fee)` : ""}.`
      : "";

    const fees = feeItems();
    $("#fees").textContent = fees.length ? `Add-ons you've asked for (quoted separately): ${fees.length}` : "";
  }


  /* ------------------------------------------------------------------------
     11. Saving drafts in the browser
     Answers stay in this browser only. Fields marked data-nosave are skipped.
     ------------------------------------------------------------------------ */
  let saveTimer = 0;

  function snapshot() {
    const fields = {};
    $$("#form input, #form select, #form textarea").forEach((el) => {
      if (!el.id || el.hasAttribute("data-nosave")) return;
      fields[el.id] = (el.type === "checkbox" || el.type === "radio") ? el.checked : el.value;
    });

    const rows = {};
    Object.entries(ROW_KINDS).forEach(([kind, cfg]) => {
      rows[kind] = $$(`${cfg.host} .row[data-kind="${kind}"]`).map((r) => +r.dataset.i);
    });

    return { fields, rows, palette };
  }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot())); } catch (e) { /* storage unavailable */ }
  }

  function restoreDraft() {
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) { /* storage unavailable */ }
    if (!draft || !draft.fields) return false;

    // Rebuild repeating rows first so their fields exist
    Object.keys(ROW_KINDS).forEach((kind) => {
      ((draft.rows && draft.rows[kind]) || []).forEach((i) => addRow(kind, i));
    });

    Object.entries(draft.fields).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type === "checkbox" || el.type === "radio") el.checked = !!value;
      else el.value = value;
    });

    palette = Array.isArray(draft.palette) ? draft.palette.slice(0, PALETTE_MAX) : [];

    $$(".style-pick").forEach((sel) => {
      $(".style-hint", sel.closest(".row")).textContent = STYLES[sel.value] || "";
    });
    FONT_ROLES.forEach((_, i) => previewFont(i));
    return true;
  }

  function addDefaultRows() {
    addRow("form");
    addRow("words");
    addRow("words");
    addRow("words");
  }

  // Runs after every change in the form
  function onChange() {
    syncDesignerChoice();
    updateProgress();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 400);
    if (!$("#summary").hidden) $("#summary").value = buildSummary();
  }


  /* ------------------------------------------------------------------------
     12. Send panel
     ------------------------------------------------------------------------ */
  const setStatus = (msg) => { $("#status").textContent = msg; };

  function fileName() {
    const slug = ($("#a-biz").value || $("#a-name").value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `website-questionnaire${slug ? "-" + slug : ""}.txt`;
  }

  // Normal browsers: save a .txt file with a temporary link
  const browserDownload = {
    save: async ({ filename, data }) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([data], { type: "text/plain;charset=utf-8" }));
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      return { status: "saved" };
    }
  };
  let downloader = null;

  function setupDownload() {
    try {
      // Inside a Claude artifact, downloads go through its own "downloads" capability
      if (window.claude && typeof window.claude.use === "function") {
        window.claude.use("downloads")
          .then((d) => { downloader = d; $("#btn-dl").hidden = !d; })
          .catch(() => {});
      } else {
        downloader = browserDownload;
        $("#btn-dl").hidden = false;
      }
    } catch (e) { /* leave the download button hidden */ }
  }

  function resetButton() {
    $("#reset-wrap").innerHTML = '<button type="button" class="btn ghost" id="btn-reset">Clear all answers</button>';
    $("#btn-reset").addEventListener("click", askReset);
  }

  function askReset() {
    const wrap = $("#reset-wrap");
    wrap.innerHTML = '<span>Clear every answer?</span>' +
      '<button type="button" class="btn sm accent" id="rs-yes">Yes, clear everything</button>' +
      '<button type="button" class="btn sm ghost" id="rs-no">Keep my answers</button>';
    $("#rs-no").addEventListener("click", resetButton);
    $("#rs-yes").addEventListener("click", clearAll);
  }

  function clearAll() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* storage unavailable */ }
    $("#form").reset();
    $$("#themes, #forms, #words").forEach((host) => { host.innerHTML = ""; });
    $$('#secs .row[data-kind="sec"]').forEach((row) => row.remove());
    Object.keys(nextIndex).forEach((k) => { nextIndex[k] = 0; });
    palette = [];
    renderPalette();
    addDefaultRows();
    $$(".fprev").forEach((p) => { p.hidden = true; });
    $$(".style-hint").forEach((h) => { h.textContent = ""; });
    $("#summary").hidden = true;
    resetButton();
    onChange();
    setStatus("All answers cleared.");
  }

  function bindSendPanel() {
    $("#btn-show").addEventListener("click", () => {
      const box = $("#summary");
      box.value = buildSummary();
      box.hidden = false;
      $("#btn-show").textContent = "Refresh my answers";
      setStatus("Here's what will be sent. It updates as you change answers.");
    });

    $("#btn-copy").addEventListener("click", () => {
      const text = buildSummary();
      const box = $("#summary");
      box.value = text;
      box.hidden = false;
      const fallback = () => {
        box.focus();
        box.select();
        setStatus("Your answers are selected below. Press Ctrl+C (or Cmd+C) to copy them.");
      };
      try {
        navigator.clipboard.writeText(text)
          .then(() => setStatus("Copied. Paste your answers into an email to Random Remi Designs."), fallback);
      } catch (e) {
        fallback();
      }
    });

    $("#btn-dl").addEventListener("click", async () => {
      if (!downloader) return;
      try {
        await downloader.save({ filename: fileName(), data: buildSummary() });
        setStatus("Downloaded. Send the file to Random Remi Designs with any logo or photo files.");
      } catch (e) {
        const code = e && e.code;
        if (code === "declined") setStatus("Download cancelled.");
        else if (code === "rate_limited") setStatus("A download is already waiting for your OK.");
        else {
          setStatus("Downloading isn't available here. Use Copy my answers instead.");
          $("#btn-dl").hidden = true;
        }
      }
    });

    $("#btn-reset").addEventListener("click", askReset);
    setupDownload();
  }


  /* ------------------------------------------------------------------------
     13. Form theme switcher (Light / Dark / Noir; "auto" follows the device)
     ------------------------------------------------------------------------ */
  function setTheme(theme) {
    const root = document.documentElement;
    root.classList.remove("t-light", "t-dark", "t-noir");
    if (theme !== "auto") root.classList.add("t-" + theme);
    $$(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === theme)));
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
  }

  function bindThemeSwitcher() {
    $$(".seg button").forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.t)));
    let saved = "auto";
    try { saved = localStorage.getItem(THEME_KEY) || "auto"; } catch (e) { /* storage unavailable */ }
    setTheme(saved);
  }


  /* ------------------------------------------------------------------------
     14. Start-up
     ------------------------------------------------------------------------ */
  bindThemeSwitcher();
  renderChoices();
  renderLabels();
  renderFixedRows();
  buildIndex();

  bindRows();
  bindFonts();
  bindColors();
  bindSendPanel();

  const form = $("#form");
  form.addEventListener("input", onChange);
  form.addEventListener("change", onChange);
  form.addEventListener("submit", (e) => e.preventDefault());

  if (!restoreDraft()) addDefaultRows();
  renderPalette();
  syncDesignerChoice();
  updateProgress();
  drawWheel();
  showPick();
})();
