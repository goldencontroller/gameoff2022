class Transition extends Phaser.Scene {

    constructor() {
        super("transition");
    }

    preload() {
        
    }

    create() {
        this.sound.stopAll();
        
        this.msg = this.add.text(100, 100, `CONGRATULATIONS
PART ${Math.floor((game.levelOn - 1) / 3) + 1}${"abc".charAt((game.levelOn - 1) % 3)} COMPLETE

KILLS: ${game.scoreStats.kills}
PROPERTY DAMAGE: $${game.scoreStats.propertyDamage}.00
`,
            {
                lineSpacing: -5,
            }
        );
        this.okButton = this.add.text(100, 500, "CONTINUE");
        this.okButton.setInteractive();
        this.okButton.on("pointerdown", function() {
            game.levelOn++;
            switch (game.levelOn) {
                case 3:
                    this.scene.start("boss1");
                    break;
                case 6:
                    this.scene.start("boss2");
                    break;
                default:
                    this.scene.start("level");
            }
        }.bind(this));
    }

    update() {
        this.scene.stop("game-over"); // weird bug???
    }

}
