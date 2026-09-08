# DnDGen

A weighted random character generator inspired by "Roll for Sandwich" and Pokédex fillers — but for D&D characters.

## Running locally

No build tools or dependencies needed. Just open the file:

```bash
# Option 1 — open directly in your browser
open index.html

# Option 2 — serve with Python (avoids any file:// quirks)
python3 -m http.server 8000
# then visit http://localhost:8000

# Option 3 — serve with Node
npx serve .
# then visit http://localhost:3000
```

## How it works

- **Start rolling** — reveals one category at a time, building your character sheet as you go
- **Roll all at once** — dumps the full character in one shot
- **Edit config** — edit the JSON directly in the app to tweak categories, options, and weights

## Customizing

The config lives in `config.js`. Each category looks like this:

```js
{
  id: "race",
  label: "Race",
  dice: "d20",          // flavor text only — shown as a badge
  note: "Weighted by commonality in most settings",
  options: [
    { value: "Human",  weight: 30 },  // 30x more likely than weight-1 options
    { value: "Elf",    weight: 15 },
    { value: "Genasi", weight: 1  },  // rare
  ]
}
```

Weights are **relative**, not percentages. To make something twice as likely, double its weight. Equal weights = equal chance.

You can also edit the config live in the **Edit config** tab in the app — changes apply immediately without reloading.

## File structure

```
dnd-roller/
├── index.html   — markup and layout
├── style.css    — all styles (light + dark mode)
├── config.js    — categories, options, and weights ← edit this
├── app.js       — roller logic
└── README.md
```
