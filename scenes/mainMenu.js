class MainMenu extends Phaser.Scene {

    constructor() {
        super("main-menu");
    }

    preload() {
        this.load.image("bg", "assets/image/coverart.jpg");
        this.load.image("johnson", "assets/image/mainLogo.png");
        this.load.audio("titleTheme", "assets/music/title.wav");
    }

    create() {
        this.sound.stopAll();
        
        this.coverArt = this.add.image(480, 270, "bg");
        
        this.logo = this.add.image(480, 96, "johnson");
        
        this.playButton = this.add.text(270, 270, "NEW GAME", {
            color: "black",
            fontSize: "24px"
        });
        this.playButton.setInteractive();
        this.playButton.on("pointerdown", function() {

            game.levelOn = 1;
            game.scoreStats = {
                kills: 0,
                propertyDamage: 0
            };
            
            this.scene.start("cutscene");
            
        }.bind(this));
        this.playButton.on("pointerover", function() { this.setColor("white"); });
        this.playButton.on("pointerout", function() { this.setColor("black"); });
        
        this.creditsButton = this.add.text(270, 300, "CREDITS", {
            color: "black",
            fontSize: "24px"
        });
        this.creditsButton.setInteractive();
        this.creditsButton.on("pointerdown", function() {
            this.scene.launch("credits");
        }.bind(this));
        this.creditsButton.on("pointerover", function() { this.setColor("white"); });
        this.creditsButton.on("pointerout", function() { this.setColor("black"); });
        
        this.music = this.sound.add("titleTheme");
        this.music.loop = true;
        this.music.play();
    }

    update() {
        
    }

}