class Credits extends Phaser.Scene {

    constructor() {
        super("credits");
    }

    preload() {
        
    }

    create() {
        var rect = this.add.rectangle(480, 270, 960, 540, 0x000000);
        rect.setInteractive();
        this.closeButton = this.add.text(100, 440, "BACK");
        this.closeButton.setInteractive();
        this.closeButton.on("pointerdown", function() {
            this.scene.stop("credits");
        }.bind(this));
        this.closeButton.on("pointerover", function() { this.setColor("grey"); });
        this.closeButton.on("pointerout", function() { this.setColor("white"); });
        this.mainText = this.add.text(100, 100, `
Created from head to toe by Yikuan Sun.
All characters and plots are fictional and do not relate to real people or events.`);
    }

    update() {
        
    }

}
