class MainMenu extends Phaser.Scene {

    constructor() {
        super("main-menu");
    }

    preload() {

    }

    create() {
        this.sound.stopAll();
        
        this.playButton = this.add.text(480, 270, "NEW GAME");
        this.playButton.setInteractive();
        this.playButton.on("pointerdown", function() {

            game.levelOn = 1;
            game.scoreStats = {
                kills: 0,
                propertyDamage: 0
            };
            
            this.scene.start("level");
            
        }.bind(this));
    }

    update() {
        
    }

}