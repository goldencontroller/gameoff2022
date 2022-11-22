class Cutscene extends Phaser.Scene {

    constructor() {
        super("cutscene");
    }

    preload() {
        
    }

    create() {
        this.sound.stopAll();
        
        this.msg = this.add.text(100, 100, "",
            {
                lineSpacing: -5,
            }
        );
        this.okButton = this.add.text(100, 440, "CONTINUE");
        this.okButton.setInteractive();
        
        switch (game.levelOn) {
            case 1:
                this.okButton.on("pointerdown", function() {
                    this.scene.start("level");
                }.bind(this));
                this.msg.setText(`AGENT RAKESH:

Your mission, if you choose to accept it:

Hunt down the renegade Srinath, who threatens the security of our organization.

If he succeeds, Srinath will disturb the current world order, ending global civilization
as we know it.

You must find and destroy him before midnight.

Also, he wears a bullet-deflecting suit. Find a way to kill him.

Good luck.

 - YOUR BOSS`);
                break;
        }
    }

    update() {
        
    }

}
