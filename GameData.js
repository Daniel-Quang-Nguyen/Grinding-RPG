// GameData.js

const GameData = {
    // --- Player Stats ---
    player: {
        level: 1,
        gold: 0,
        exp: 0,
        maxHP: 100,
        currentHP: 100,
        attack: 10,
        defense: 5,
        mana: 50,
        skillPoints: 0,
    },

    // --- Upgrade Tree Structure ---
    upgrades: {
        // Attack Branch
        power_strike: { 
            name: "Power Strike", 
            cost: 100, 
            description: "+5 Attack permanently.", 
            isUnlocked: false,
            prerequisite: null,
            effect: () => { GameData.player.attack += 5; }
        },
        crit_mastery: { 
            name: "Crit Mastery", 
            cost: 300, 
            description: "+10 Attack and 5% Crit Chance.", 
            isUnlocked: false,
            prerequisite: "power_strike",
            effect: () => { GameData.player.attack += 10; /* Add crit logic later */ }
        },

        // Defense Branch
        iron_skin: { 
            name: "Iron Skin", 
            cost: 150, 
            description: "+5 Defense and +20 Max HP.", 
            isUnlocked: false,
            prerequisite: null,
            effect: () => { 
                GameData.player.defense += 5; 
                GameData.player.maxHP += 20;
                GameData.player.currentHP += 20; // Heal for the new amount
            }
        },
        // ... more upgrades
    },

    // --- Game Progression ---
    chapter: 1,
    chapterData: {
        1: { name: "The Village Gate", mapKey: "map_chapter1", enemyType: "goblin" },
        2: { name: "The Sunken Crypt", mapKey: "map_chapter2", enemyType: "skeleton" },
        // ... more chapters
    },

    // --- Save/Load (Placeholder) ---
    saveGame: function() {
        console.log("Game Saved:", this.player);
        // localStorage.setItem('grinding_rpg_save', JSON.stringify(this.player));
    },

    loadGame: function() {
        // Implement load logic here
        // const savedData = localStorage.getItem('grinding_rpg_save');
        // if (savedData) { this.player = JSON.parse(savedData); }
    }
};