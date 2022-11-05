class Transition extends Phaser.Scene {

    constructor() {
        super("transition");
    }

    preload() {
        
    }

    create() {
        this.msg = this.add.text(100, 100, `
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
