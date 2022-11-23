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
        this.okButton.on("pointerover", function() { this.setColor("grey"); });
        this.okButton.on("pointerout", function() { this.setColor("white"); });
        
        switch (game.levelOn) {
            case 1:
                this.okButton.on("pointerdown", function() {
                    this.scene.start("level");
                }.bind(this));
                this.msg.setText(`AGENT RAKESH:

Your mission, if you choose to accept it:

Hunt down the renegade Srinath, who threatens the security of our organization.

If they succeed, Srinath and his goons will disturb the current world order, ending
global civilization as we know it.

You must find and destroy him before midnight.

Also, he wears a bullet-deflecting suit. Find a way to kill him.

Good luck.

 - YOUR BOSS`);
                break;
            case 4:
                this.okButton.on("pointerdown", function() {
                    this.scene.start("level");
                }.bind(this));
                this.msg.setText(`AGENT RAKESH:

Good work. Eyewitness accounts report that Srinath survived the fall, but you weakened
him and his men and are one step closer to taking him down.

Also, he apparently has a jetpack now. You might want to shoot his jetpack to beat him.

Good luck.

 - YOUR BOSS`);
                break;
            case 10:
                this.okButton.on("pointerdown", function() {
                    this.scene.start("main-menu");
                }.bind(this));
                this.okButton.setText("RETURN TO MAIN MENU");
                this.msg.setText(`AGENT RAKESH:

Congratulations! The mission was a success. You have defeated Srinath. Good work.

I think you're a very hard-working and noble agent. Therefore, I trust you to know
the real reason behind the mission.

Srinath was trying to expose the internal corruption of our organization: the
scandals committed by my boss. I sent you to fix the loose ends for me. I get to
keep my job because of you. If word gets out, my boss will kill us both. That is,
if I don't get to you first.

Again, thanks so much for the help!

Lots of love,

 - YOUR BOSS`);
                break;
        }
    }

    update() {
        
    }

}
