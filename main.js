// main.js

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // Enable pixel art rendering globally
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true, // Uncomment for collision visualization
            gravity: { y: 0 }
        }
    },
    // The initial scene list
    scene: [GameScene, UpgradeScene],
    pixelArt: true // Critical for crisp pixel graphics
};

const game = new Phaser.Game(config);

// Load saved data on startup
GameData.loadGame();