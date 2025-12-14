// UpgradeScene.js

class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#222222');
        this.add.text(50, 50, 'Upgrade Tree', { fontSize: '32px', color: '#ffcc00' }).setOrigin(0);
        
        // Display current stats
        this.statsText = this.add.text(50, 100, 
            `Gold: ${GameData.player.gold} | SP: ${GameData.player.skillPoints}`, 
            { fontSize: '18px', color: '#ffffff' }
        ).setOrigin(0);

        let yOffset = 150;
        const buttonStyle = { fontSize: '16px', color: '#00ff00', backgroundColor: '#333' };

        // Draw the upgrades
        Object.entries(GameData.upgrades).forEach(([key, upgrade]) => {
            const isUnlocked = upgrade.isUnlocked;
            const canAfford = GameData.player.gold >= upgrade.cost;
            
            // Check prerequisites
            let prereqMet = true;
            if (upgrade.prerequisite && !GameData.upgrades[upgrade.prerequisite].isUnlocked) {
                prereqMet = false;
            }

            const status = isUnlocked ? 'UNLOCKED' : (prereqMet ? (canAfford ? 'BUY' : `COST: ${upgrade.cost}G`) : 'LOCKED');
            const color = isUnlocked ? '#007700' : (canAfford && prereqMet ? '#00ff00' : '#ff0000');

            // Upgrade Name and Description
            this.add.text(50, yOffset, upgrade.name, { fontSize: '20px', color: '#ffffff' }).setOrigin(0);
            this.add.text(50, yOffset + 25, upgrade.description, { fontSize: '14px', color: '#aaaaaa' }).setOrigin(0);
            
            // Button/Status Text (Make it interactable if possible)
            const buyText = this.add.text(350, yOffset + 12, status, { fontSize: '18px', color: color })
                .setInteractive()
                .on('pointerdown', () => this.handleUpgrade(key, upgrade, canAfford, prereqMet));
            
            yOffset += 70;
        });

        // Back to Game Button
        this.add.text(50, 550, '<< Back to Grinding >>', buttonStyle)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.stop('UpgradeScene');
                this.scene.resume('GameScene');
            });
    }

    handleUpgrade(key, upgrade, canAfford, prereqMet) {
        if (!upgrade.isUnlocked && canAfford && prereqMet) {
            GameData.player.gold -= upgrade.cost;
            upgrade.isUnlocked = true;
            upgrade.effect(); // Apply the stat effect
            GameData.saveGame();
            
            // Reload the scene to update the display
            this.scene.restart(); 
            console.log(`Upgraded: ${upgrade.name}`);
        } else if (!prereqMet) {
            console.log("Prerequisite not met!");
        } else if (!canAfford) {
            console.log("Not enough gold!");
        }
    }
}