class MainMenu extends Phaser.Scene {

    constructor() {
        super("main-menu");
    }

    preload() {
        this.load.image("bg", "assets/image/coverart.jpg");
        this.load.image("johnson", "assets/image/mainLogo.png");
    }

    create() {
        this.sound.stopAll();
        
        this.coverArt = this.add.image(480, 270, "bg");
        
        this.logo = this.add.image(480, 96, "johnson");
        
        this.playButton = this.add.text(270, 270, "NEW GAME");
        this.playButton.setInteractive();
        this.playButton.on("pointerdown", function() {

            game.levelOn = 1;
            game.scoreStats = {
                kills: 0,
                propertyDamage: 0
            };
            
            this.scene.start("cutscene");
            
        }.bind(this));
        
        this.creditsButton = this.add.text(270, 300, "CREDITS");
        this.creditsButton.setInteractive();
    }

    update() {
        
    }

}