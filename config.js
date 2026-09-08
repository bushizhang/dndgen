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

// Classes whose Deity/Patron roll gets triggered automatically after Class is rolled.
// Forgotten Realms pantheon — swap for your setting's own.
const CLASS_DEITY_TRIGGERS = {
  "Cleric":  {
    dice: "d20",
    note: "Domain deity — swap for your setting's pantheon",
    options: [
      { value: "Bahamut (justice, dragons)",      weight: 6 },
      { value: "Tiamat (greed, dragons)",         weight: 4 },
      { value: "Corellon Larethian (elves, art)", weight: 6 },
      { value: "Moradin (dwarves, creation)",     weight: 6 },
      { value: "Lathander (dawn, renewal)",       weight: 8 },
      { value: "Selûne (moon, guidance)",         weight: 7 },
      { value: "Shar (loss, darkness)",           weight: 5 },
      { value: "Mystra (magic)",                  weight: 7 },
      { value: "Tempus (war, battle)",            weight: 6 },
      { value: "Kelemvor (death, judgment)",      weight: 5 },
      { value: "Tymora (luck, fortune)",          weight: 7 },
      { value: "Ilmater (endurance, suffering)",  weight: 5 },
      { value: "Torm (duty, loyalty)",            weight: 5 },
      { value: "Helm (protection, vigilance)",    weight: 5 },
      { value: "Waukeen (trade, wealth)",         weight: 4 },
      { value: "Gruumsh (destruction, orcs)",     weight: 3 },
      { value: "Vecna (secrets, forbidden lore)", weight: 2 }
    ]
  },
  "Paladin": {
    dice: "d20",
    note: "Deity behind the Oath — swap for your setting's pantheon",
    options: [
      { value: "Torm (duty, loyalty)",            weight: 8 },
      { value: "Ilmater (endurance, suffering)",  weight: 6 },
      { value: "Helm (protection, vigilance)",    weight: 6 },
      { value: "Bahamut (justice, dragons)",      weight: 7 },
      { value: "Tyr (justice, law)",               weight: 6 },
      { value: "Lathander (dawn, renewal)",       weight: 6 },
      { value: "Tempus (war, battle)",            weight: 6 },
      { value: "Kelemvor (death, judgment)",      weight: 4 },
      { value: "No named deity — serves an ideal",weight: 10 }
    ]
  }
};

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
    dice: "d13",
    note: "Equal weight — all classes are equally valid",
    options: [
      { value: "Artificer", weight: 1, subOptions: [
          { value: "Alchemist",   weight: 1 },
          { value: "Armorer",     weight: 1 },
          { value: "Artillerist", weight: 1 },
          { value: "Battle Smith",weight: 1 },
          { value: "Cartographer",weight: 1 },
          { value: "Reanimator",  weight: 1 }
        ]
      },
      { value: "Barbarian", weight: 1, subOptions: [
          { value: "Path of the Berserker",         weight: 1 },
          { value: "Path of the Wild Heart",         weight: 1 },
          { value: "Path of the World Tree",         weight: 1 },
          { value: "Path of the Zealot",             weight: 1 },
          { value: "Path of the Elements",           weight: 1 },
          { value: "Path of the Spiritual Guardian", weight: 1 }
        ]
      },
      { value: "Bard",      weight: 1, subOptions: [
          { value: "College of Dance",   weight: 1 },
          { value: "College of Glamour", weight: 1 },
          { value: "College of Lore",    weight: 1 },
          { value: "College of Valor",   weight: 1 },
          { value: "College of the Moon",weight: 1 },
          { value: "College of Spirits", weight: 1 }
        ]
      },
      { value: "Cleric",    weight: 1, subOptions: [
          { value: "Life Domain",      weight: 1 },
          { value: "Light Domain",     weight: 1 },
          { value: "Trickery Domain",  weight: 1 },
          { value: "War Domain",       weight: 1 },
          { value: "Knowledge Domain", weight: 1 },
          { value: "Grave Domain",     weight: 1 },
          { value: "Arcana Domain",    weight: 1 },
          { value: "Shadow Domain",    weight: 1 },
          { value: "Discipline Domain",weight: 1 }
        ]
      },
      { value: "Druid",     weight: 1, subOptions: [
          { value: "Circle of the Land",  weight: 1 },
          { value: "Circle of the Moon",  weight: 1 },
          { value: "Circle of the Sea",   weight: 1 },
          { value: "Circle of the Stars", weight: 1 }
        ]
      },
      { value: "Fighter",   weight: 1, subOptions: [
          { value: "Battle Master",   weight: 1 },
          { value: "Champion",        weight: 1 },
          { value: "Eldritch Knight", weight: 1 },
          { value: "Psi Warrior",     weight: 1 },
          { value: "Banneret",        weight: 1 },
          { value: "Arcane Archer",   weight: 1 }
        ]
      },
      { value: "Monk",      weight: 1, subOptions: [
          { value: "Warrior of the Elements",   weight: 1 },
          { value: "Warrior of Mercy",          weight: 1 },
          { value: "Warrior of the Open Hand",  weight: 1 },
          { value: "Warrior of Shadow",         weight: 1 },
          { value: "Warrior of the Mystic Arts",weight: 1 },
          { value: "Warrior of Mystic Brews",   weight: 1 }
        ]
      },
      { value: "Paladin",   weight: 1, subOptions: [
          { value: "Oath of the Ancients",   weight: 1 },
          { value: "Oath of Devotion",       weight: 1 },
          { value: "Oath of Glory",          weight: 1 },
          { value: "Oath of Vengeance",      weight: 1 },
          { value: "Oath of the Noble Genies",weight: 1 },
          { value: "Oath of the Ebon Blade", weight: 1 },
          { value: "Oath of the Holy",       weight: 1 }
        ]
      },
      { value: "Ranger",    weight: 1, subOptions: [
          { value: "Beast Master",  weight: 1 },
          { value: "Fey Wanderer",  weight: 1 },
          { value: "Gloom Stalker", weight: 1 },
          { value: "Hunter",        weight: 1 },
          { value: "Winter Walker", weight: 1 },
          { value: "Hollow Warden", weight: 1 },
          { value: "Demon Hunter",  weight: 1 }
        ]
      },
      { value: "Rogue",     weight: 1, subOptions: [
          { value: "Arcane Trickster", weight: 1 },
          { value: "Assassin",         weight: 1 },
          { value: "Soulknife",        weight: 1 },
          { value: "Thief",            weight: 1 },
          { value: "Scion of the Three",weight: 1 },
          { value: "Phantom",          weight: 1 },
          { value: "Swashbuckler",     weight: 1 }
        ]
      },
      { value: "Sorcerer",  weight: 1, subOptions: [
          { value: "Aberrant Sorcery",  weight: 1 },
          { value: "Clockwork Sorcery", weight: 1 },
          { value: "Draconic Sorcery",  weight: 1 },
          { value: "Wild Magic Sorcery",weight: 1 },
          { value: "Spellfire Sorcery", weight: 1 },
          { value: "Shadow Sorcery",    weight: 1 }
        ]
      },
      { value: "Warlock",   weight: 1, subOptions: [
          { value: "Archfey Patron",     weight: 1 },
          { value: "Celestial Patron",   weight: 1 },
          { value: "Fiend Patron",       weight: 1 },
          { value: "Great Old One Patron",weight: 1 },
          { value: "Undead Patron",      weight: 1 },
          { value: "Vestige Patron",     weight: 1 }
        ]
      },
      { value: "Wizard",    weight: 1, subOptions: [
          { value: "Abjurer",     weight: 1 },
          { value: "Diviner",     weight: 1 },
          { value: "Evoker",      weight: 1 },
          { value: "Illusionist", weight: 1 },
          { value: "Bladesinger", weight: 1 },
          { value: "Conjurer",    weight: 1 },
          { value: "Enchanter",   weight: 1 },
          { value: "Necromancer", weight: 1 },
          { value: "Transmuter",  weight: 1 }
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
    id: "bond",
    group: "personality",
    label: "Bond",
    dice: "d10",
    note: "What they're tied to, beyond themselves",
    options: [
      { value: "I would die to recover a relic lost to my people long ago.",  weight: 1 },
      { value: "I owe my life to the one who took me in when I had nothing.",weight: 1 },
      { value: "Everything I do is for the common people.",                  weight: 1 },
      { value: "I will face any challenge to win my family's approval.",     weight: 1 },
      { value: "My home is worth fighting for, no matter the cost.",         weight: 1 },
      { value: "I've been hunting my family's killer for years.",           weight: 1 },
      { value: "An injury to the wilds is an injury to me.",                 weight: 1 },
      { value: "I protect those who cannot protect themselves.",             weight: 1 },
      { value: "I'm working off a debt to a benefactor I can't refuse.",     weight: 1 },
      { value: "My most treasured possession was a gift from someone I lost.",weight: 1 }
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
