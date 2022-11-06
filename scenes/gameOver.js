class GameOver extends Phaser.Scene {

    constructor() {
        super("game-over");
    }

    preload() {
        
    }

    create() {
        this.msg = this.add.text(100, 100, `MISSION FAILED.

YOU MADE IT TO PART ${Math.floor((game.levelOn - 1) / 3) + 1}${"abc".charAt((game.levelOn - 1) % 3)}

KILLS: ${game.scoreStats.kills}
PROPERTY DAMAGE: $${game.scoreStats.propertyDamage}.00
`,
            {
                lineSpacing: -5,
            }
        );
    }

    update() {
        
    }

}
