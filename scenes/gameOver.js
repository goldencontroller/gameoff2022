class GameOver extends Phaser.Scene {

    constructor() {
        super("game-over");
    }

    preload() {
        
    }

    create() {
        this.sound.stopAll();
        
        this.msg = this.add.text(100, 100, `MISSION FAILED.

YOU MADE IT TO PART ${Math.floor((game.levelOn - 1) / 3) + 1}${"abc".charAt((game.levelOn - 1) % 3)}

KILLS: ${game.scoreStats.kills}
PROPERTY DAMAGE: $${game.scoreStats.propertyDamage}.00
`,
            {
                lineSpacing: -5,
            }
        );
        this.okButton = this.add.text(100, 500, "RETURN TO MAIN MENU");
        this.okButton.setInteractive();
        this.okButton.on("pointerdown", function() {
            this.scene.start("main-menu");
        }.bind(this));
    }

    update() {
        
    }

}
