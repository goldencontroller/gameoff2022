class StudioLogo extends Phaser.Scene {

    constructor() {
        super("studio-logo");
    }

    preload() {
        this.load.image("logo", "assets/image/studiologo.jpg");
    }

    create() {
        this.logoImage = this.physics.add.image(480, 270, "logo");
        this.logoImage.alpha = 0;
        this.timeLeft = 444;
        this.stillLogoTimeLeft = 111;
    }

    update() {
        var gclogo = this.logoImage;
        if (this.timeLeft) {
            this.timeLeft--;
            console.log(gclogo.alpha, this.stillLogoTimeLeft)
            if (gclogo.alpha < 1 && this.stillLogoTimeLeft) {
                gclogo.alpha += 0.02;
            }
            else if (gclogo.alpha >= 1 && this.stillLogoTimeLeft) {
                this.stillLogoTimeLeft--;
            }
            else if (gclogo.alpha > 0) {
                gclogo.alpha -= 0.02;
            }
        }
        else {
            this.scene.start("level");
        }
    }

}

