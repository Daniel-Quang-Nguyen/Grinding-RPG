// GameScene.js

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.TILE_SIZE = 32;
    }

    preload() {
        // In a real game, you would load your Tiled map JSON and pixel art spritesheets here
        this.load.image('tiles', 'assets/tileset.png'); // Placeholder for a generic tileset
        this.load.image('knight_sprite', 'assets/knight.png'); // Player placeholder
        this.load.image('portal_sprite', 'assets/portal.png'); // Portal placeholder
        this.load.image('enemy_sprite', 'assets/goblin.png'); // Enemy placeholder
    }

    create() {
        // --- Game Setup ---
        this.cameras.main.setBackgroundColor('#444444');
        this.cameras.main.setZoom(2); // Pixel art zoom
        this.cameras.main.setRoundPixels(true); // Essential for crisp pixel art

        // Load the map for the current chapter (Chapter 1 - Village Gate)
        const chapter = GameData.chapterData[GameData.chapter];
        
        // This line would typically load a map exported from Tiled: 
        // this.map = this.make.tilemap({ key: chapter.mapKey }); 
        // For simplicity, we'll create a basic scene environment.
        
        // Simple Environment (instead of a full Tiled map)
        this.add.tileSprite(0, 0, 800, 600, 'tiles').setOrigin(0);
        this.add.text(10, 10, chapter.name, { fontSize: '16px', color: '#ffcc00' }).setScrollFactor(0);


        // --- Player Setup (Knight) ---
        this.player = this.physics.add.sprite(400, 300, 'knight_sprite').setScale(1);
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);

        // --- Portal/Next Chapter Setup ---
        this.portal = this.physics.add.sprite(700, 300, 'portal_sprite').setScale(1);

        // --- Input and Physics ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.world.setBounds(0, 0, 800, 600);
        
        // Add overlap detection for the portal (Next Chapter logic)
        this.physics.add.overlap(this.player, this.portal, this.startNextChapter, null, this);

        // --- Enemy Setup (The Grinding Part) ---
        this.enemies = this.physics.add.group();
        this.spawnEnemies(5, chapter.enemyType);

        // --- UI Text ---
        this.uiText = this.add.text(10, 500, '', { fontSize: '14px', color: '#ffffff' }).setScrollFactor(0);
        this.updateUI();

        // --- Open Upgrade Screen Button ---
        this.add.text(650, 10, 'UPGRADES', { fontSize: '16px', color: '#00ccff', backgroundColor: '#333' })
            .setInteractive()
            .setScrollFactor(0)
            .on('pointerdown', () => {
                this.scene.pause('GameScene');
                this.scene.launch('UpgradeScene');
            });
    }

    update() {
        // --- Player Movement ---
        const speed = 150;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }

        this.player.body.velocity.normalize().scale(speed);
    }

    updateUI() {
        const p = GameData.player;
        this.uiText.setText([
            `Level: ${p.level} | HP: ${p.currentHP}/${p.maxHP} | Mana: ${p.mana}`,
            `Attack: ${p.attack} | Defense: ${p.defense}`,
            `Gold: ${p.gold} | EXP: ${p.exp}%`,
        ]);
    }

    spawnEnemies(count, enemyKey) {
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            const enemy = this.enemies.create(x, y, 'enemy_sprite');
            enemy.setTint(0xff0000);
            enemy.setInteractive();
            enemy.on('pointerdown', () => this.handleCombat(enemy));
        }
    }
    
    // --- Core Combat/Grinding Logic (Simplified) ---
    handleCombat(enemy) {
        const damage = GameData.player.attack;
        
        // 1. Player deals damage
        console.log(`Player hits ${GameData.chapterData[GameData.chapter].enemyType} for ${damage} damage!`);
        
        // 2. Enemy "dies" (simplification for a quick grind loop)
        enemy.destroy(); 

        // 3. Reward Player
        GameData.player.gold += 10;
        GameData.player.exp += 5;

        if (GameData.player.exp >= 100) {
            this.levelUp();
        }

        this.updateUI();
        this.spawnEnemies(1, GameData.chapterData[GameData.chapter].enemyType); // Respawn instantly
    }

    levelUp() {
        GameData.player.level++;
        GameData.player.exp = 0;
        GameData.player.maxHP += 10;
        GameData.player.currentHP = GameData.player.maxHP;
        GameData.player.attack += 2;
        GameData.player.skillPoints += 1;
        
        this.add.text(this.player.x, this.player.y - 30, 'LEVEL UP!', { fontSize: '24px', color: '#00ff00' });
    }

    // --- Chapter Progression ---
    startNextChapter() {
        GameData.chapter++;
        if (GameData.chapter > Object.keys(GameData.chapterData).length) {
            // End of Game (for this example)
            alert("Congratulations! You have completed the Grinding Saga! Starting over...");
            GameData.chapter = 1; 
        }

        // Restart the scene with the new chapter data
        this.scene.restart();
    }
}