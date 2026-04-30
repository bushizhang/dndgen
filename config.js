// ============================================================
//  D&D CHARACTER ROLLER — CONFIG
//
//  Each category has:
//    id      — unique key (no spaces)
//    label   — displayed name
//    dice    — flavor text shown as a badge (d6, d20, d100, etc.)
//    note    — small description shown under the result
//    options — array of { value, weight }
//
//  Weights are RELATIVE, not percentages.
//  Double a weight to make something twice as likely.
//  Equal weights = equal chance.
// ============================================================

const GROUPS = [
  { id: 'character',   label: 'Character' },
  { id: 'physical',    label: 'Physical traits' },
  { id: 'personality', label: 'Personality' },
];

const DEFAULT_CONFIG = [
  {
    id: "race",
    group: "character",
    label: "Race",
    dice: "d20",
    note: "Weighted by commonality in most settings",
    options: [
      { value: "Human",      weight: 30 },
      { value: "Elf",        weight: 15 },
      { value: "Dwarf",      weight: 12 },
      { value: "Halfling",   weight: 10 },
      { value: "Half-Elf",   weight: 8  },
      { value: "Gnome",      weight: 7  },
      { value: "Half-Orc",   weight: 6  },
      { value: "Tiefling",   weight: 5  },
      { value: "Dragonborn", weight: 4  },
      { value: "Aasimar",    weight: 2  },
      { value: "Genasi",     weight: 1  }
    ]
  },
  {
    id: "class",
    group: "character",
    label: "Class",
    dice: "d12",
    note: "Equal weight — all classes are equally valid",
    options: [
      { value: "Fighter",   weight: 1, subOptions: [
          { value: "Champion",        weight: 1 },
          { value: "Battle Master",   weight: 1 },
          { value: "Eldritch Knight", weight: 1 },
          { value: "Psi Warrior",     weight: 1 },
          { value: "Rune Knight",     weight: 1 }
        ]
      },
      { value: "Rogue",     weight: 1, subOptions: [
          { value: "Thief",            weight: 1 },
          { value: "Arcane Trickster", weight: 1 },
          { value: "Assassin",         weight: 1 },
          { value: "Swashbuckler",     weight: 1 },
          { value: "Phantom",          weight: 1 }
        ]
      },
      { value: "Wizard",    weight: 1, subOptions: [
          { value: "Evocation",   weight: 1 },
          { value: "Illusion",    weight: 1 },
          { value: "Abjuration",  weight: 1 },
          { value: "Divination",  weight: 1 },
          { value: "Necromancy",  weight: 1 }
        ]
      },
      { value: "Cleric",    weight: 1, subOptions: [
          { value: "Life Domain",    weight: 1 },
          { value: "Light Domain",   weight: 1 },
          { value: "Trickery Domain",weight: 1 },
          { value: "War Domain",     weight: 1 },
          { value: "Tempest Domain", weight: 1 }
        ]
      },
      { value: "Ranger",    weight: 1, subOptions: [
          { value: "Hunter",         weight: 1 },
          { value: "Gloom Stalker",  weight: 1 },
          { value: "Beast Master",   weight: 1 },
          { value: "Fey Wanderer",   weight: 1 },
          { value: "Monster Slayer", weight: 1 }
        ]
      },
      { value: "Paladin",   weight: 1, subOptions: [
          { value: "Oath of Devotion",   weight: 1 },
          { value: "Oath of the Ancients",weight: 1 },
          { value: "Oath of Vengeance",  weight: 1 },
          { value: "Oath of Conquest",   weight: 1 },
          { value: "Oath of Redemption", weight: 1 }
        ]
      },
      { value: "Bard",      weight: 1, subOptions: [
          { value: "College of Lore",      weight: 1 },
          { value: "College of Valor",     weight: 1 },
          { value: "College of Glamour",   weight: 1 },
          { value: "College of Swords",    weight: 1 },
          { value: "College of Eloquence", weight: 1 }
        ]
      },
      { value: "Druid",     weight: 1, subOptions: [
          { value: "Circle of the Moon",  weight: 1 },
          { value: "Circle of the Land",  weight: 1 },
          { value: "Circle of Dreams",    weight: 1 },
          { value: "Circle of Spores",    weight: 1 },
          { value: "Circle of Stars",     weight: 1 }
        ]
      },
      { value: "Barbarian", weight: 1, subOptions: [
          { value: "Path of the Berserker",        weight: 1 },
          { value: "Path of the Totem Warrior",    weight: 1 },
          { value: "Path of the Ancestral Guardian",weight: 1 },
          { value: "Path of the Storm Herald",     weight: 1 },
          { value: "Path of the Zealot",           weight: 1 }
        ]
      },
      { value: "Monk",      weight: 1, subOptions: [
          { value: "Way of the Open Hand",    weight: 1 },
          { value: "Way of Shadow",           weight: 1 },
          { value: "Way of the Kensei",       weight: 1 },
          { value: "Way of the Drunken Master",weight: 1 },
          { value: "Way of the Astral Self",  weight: 1 }
        ]
      },
      { value: "Warlock",   weight: 1, subOptions: [
          { value: "The Fiend",        weight: 1 },
          { value: "The Great Old One",weight: 1 },
          { value: "The Archfey",      weight: 1 },
          { value: "The Hexblade",     weight: 1 },
          { value: "The Celestial",    weight: 1 }
        ]
      },
      { value: "Sorcerer",  weight: 1, subOptions: [
          { value: "Draconic Bloodline", weight: 1 },
          { value: "Wild Magic",         weight: 1 },
          { value: "Shadow Magic",       weight: 1 },
          { value: "Divine Soul",        weight: 1 },
          { value: "Aberrant Mind",      weight: 1 }
        ]
      }
    ]
  },
  {
    id: "background",
    group: "character",
    label: "Background",
    dice: "d10",
    note: "Slightly weighted toward common folk",
    options: [
      { value: "Soldier",    weight: 12 },
      { value: "Criminal",   weight: 12 },
      { value: "Folk Hero",  weight: 12 },
      { value: "Acolyte",    weight: 10 },
      { value: "Outlander",  weight: 10 },
      { value: "Sage",       weight: 8  },
      { value: "Merchant",   weight: 8  },
      { value: "Hermit",     weight: 8  },
      { value: "Sailor",     weight: 8  },
      { value: "Noble",      weight: 7  },
      { value: "Charlatan",  weight: 5  }
    ]
  },
  {
    id: "alignment",
    group: "personality",
    label: "Alignment",
    dice: "d9",
    note: "Neutral/good most common, chaotic evil rare",
    options: [
      { value: "Lawful Good",    weight: 15 },
      { value: "Neutral Good",   weight: 18 },
      { value: "Chaotic Good",   weight: 14 },
      { value: "Lawful Neutral", weight: 12 },
      { value: "True Neutral",   weight: 16 },
      { value: "Chaotic Neutral",weight: 12 },
      { value: "Lawful Evil",    weight: 6  },
      { value: "Neutral Evil",   weight: 5  },
      { value: "Chaotic Evil",   weight: 2  }
    ]
  },
  {
    id: "motivation",
    group: "personality",
    label: "Motivation",
    dice: "d8",
    note: "What drives them to adventure",
    options: [
      { value: "Revenge",              weight: 14 },
      { value: "Wealth",               weight: 16 },
      { value: "Glory & Fame",         weight: 14 },
      { value: "Duty / Oath",          weight: 12 },
      { value: "Wanderlust",           weight: 12 },
      { value: "Redemption",           weight: 10 },
      { value: "Forbidden Knowledge",  weight: 8  },
      { value: "Protecting loved ones",weight: 14 }
    ]
  },
  {
    id: "flaw",
    group: "personality",
    label: "Character flaw",
    dice: "d6",
    note: "Equal weight — all flaws are equally juicy",
    options: [
      { value: "Cowardly when stakes are highest", weight: 1 },
      { value: "Insufferably arrogant",            weight: 1 },
      { value: "Can't resist a gamble",            weight: 1 },
      { value: "Harbors a secret shame",           weight: 1 },
      { value: "Distrusts everyone",               weight: 1 },
      { value: "Reckless to a fault",              weight: 1 }
    ]
  },
  {
    id: "gender",
    group: "physical",
    label: "Gender",
    dice: "d4",
    note: "Adjust to fit your setting",
    options: [
      { value: "Male",       weight: 40 },
      { value: "Female",     weight: 40 },
      { value: "Non-binary", weight: 10 },
      { value: "Fluid",      weight: 10 }
    ]
  },
  {
    id: "hair_length",
    group: "physical",
    label: "Hair length",
    dice: "d4",
    note: "Or bald — adventuring takes a toll",
    options: [
      { value: "Short",          weight: 30 },
      { value: "Medium",         weight: 25 },
      { value: "Long",           weight: 25 },
      { value: "Shaved / Bald",  weight: 20 }
    ]
  },
  {
    id: "hair_color",
    group: "physical",
    label: "Hair color",
    dice: "d8",
    note: "Natural tones weighted higher",
    options: [
      { value: "Black",          weight: 25 },
      { value: "Dark brown",     weight: 22 },
      { value: "Auburn",         weight: 12 },
      { value: "Blonde",         weight: 14 },
      { value: "Red",            weight: 8  },
      { value: "Grey / White",   weight: 10 },
      { value: "Silver (elven)", weight: 5  },
      { value: "Unnatural hue",  weight: 4  }
    ]
  },
  {
    id: "eye_color",
    group: "physical",
    label: "Eye color",
    dice: "d6",
    note: "Brown and blue dominate most species",
    options: [
      { value: "Brown",         weight: 32 },
      { value: "Blue",          weight: 20 },
      { value: "Green",         weight: 15 },
      { value: "Grey",          weight: 13 },
      { value: "Hazel",         weight: 12 },
      { value: "Amber",         weight: 5  },
      { value: "Violet (rare)", weight: 2  },
      { value: "Silver (rare)", weight: 1  }
    ]
  },
  {
    id: "height",
    group: "physical",
    label: "Height",
    dice: "d6",
    note: "Relative to average for their species",
    options: [
      { value: "Short",          weight: 15 },
      { value: "Slightly short", weight: 25 },
      { value: "Average",        weight: 30 },
      { value: "Slightly tall",  weight: 20 },
      { value: "Tall",           weight: 10 }
    ]
  },
  {
    id: "build",
    group: "physical",
    label: "Build",
    dice: "d6",
    note: "Physical frame and musculature",
    options: [
      { value: "Lean",         weight: 25 },
      { value: "Athletic",     weight: 25 },
      { value: "Average",      weight: 20 },
      { value: "Stocky",       weight: 15 },
      { value: "Heavyset",     weight: 10 },
      { value: "Wiry / Gaunt", weight: 5  }
    ]
  },
  {
    id: "distinguishing",
    group: "physical",
    label: "Distinguishing feature",
    dice: "d8",
    note: "A visible physical quirk",
    options: [
      { value: "Prominent facial scar", weight: 16 },
      { value: "Unusual eye color",     weight: 14 },
      { value: "Ritual tattoos",        weight: 12 },
      { value: "Missing finger",        weight: 10 },
      { value: "Unsettling pallor",     weight: 10 },
      { value: "Heterochromia",         weight: 8  },
      { value: "Streak of white hair",  weight: 8  },
      { value: "Glowing faint mark",    weight: 6  },
      { value: "Brand or burn scar",    weight: 8  },
      { value: "Prosthetic limb",       weight: 8  }
    ]
  },
  {
    id: "magic_item",
    group: "character",
    label: "Starting magic item",
    dice: "d100",
    note: "Rarity weighted heavily — most start with nothing",
    options: [
      { value: "None",                                      weight: 55 },
      { value: "Common trinket (e.g. everfull waterskin)",  weight: 22 },
      { value: "Uncommon item (e.g. +1 weapon)",            weight: 14 },
      { value: "Rare item (e.g. Bag of Holding)",           weight: 7  },
      { value: "Very rare item (e.g. Ring of Spell Storing)",weight: 2 }
    ]
  },
  {
    id: "quirk",
    group: "personality",
    label: "Personality quirk",
    dice: "d8",
    note: "Equal weight — each is equally fun",
    options: [
      { value: "Talks to inanimate objects",       weight: 1 },
      { value: "Collects strange trinkets",        weight: 1 },
      { value: "Can't resist any dare",            weight: 1 },
      { value: "Quotes proverbs, often wrong",     weight: 1 },
      { value: "Laughs at inappropriate times",    weight: 1 },
      { value: "Never uses contractions",          weight: 1 },
      { value: "Hums while thinking",              weight: 1 },
      { value: "Overly formal with strangers",     weight: 1 }
    ]
  },
  {
    id: "dark_secret",
    group: "personality",
    label: "Dark secret",
    dice: "d6",
    note: "Most adventurers carry no dark secret",
    options: [
      { value: "None",                              weight: 45 },
      { value: "Minor (embarrassing past)",         weight: 25 },
      { value: "Moderate (hurt someone they loved)",weight: 15 },
      { value: "Serious (a crime unpunished)",      weight: 10 },
      { value: "Grave (responsible for many deaths)",weight: 5 }
    ]
  }
];
