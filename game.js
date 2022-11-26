var game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 960,
    height: 540,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: true,
            fps: 60
        }
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scene: [StudioLogo, Level, Boss1, Boss2, Transition, GameOver, MainMenu, Cutscene, Credits],
    pixelArt: false
});

game.levelOn = 1;
game.scoreStats = {
    kills: 0,
    propertyDamage: 0
};