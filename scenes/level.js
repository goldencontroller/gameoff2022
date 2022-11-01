class Level extends Phaser.Scene {

    constructor() {
        super("level");
    }

    preload() {
        this.load.image("world1brick", "assets/image/world1brick.png");
    }

    create() {
        var graphics = this.add.graphics();
        graphics.fillGradientStyle(0x00d8ff, 0x00d8ff, 0x003ebd, 0x003ebd, 1);
        graphics.fillRect(0, 0, 960, 540);
        
        var levelStats = {
            stdBuildingWidth: 10,
            buildingWidthDev: 3,
            numBuildings: 12,
            stdGapWidth: 3,
            gapWidthDev: 1,
            stdBuildingHeight: 5,
            buildingHeightDev: 2,
        };
        
        this.bricks = this.physics.add.staticGroup();
        var buildingStartPos = 2;
        for (var i = 0; i < levelStats.numBuildings; i++) {
            var buildingWidth = levelStats.stdBuildingWidth + (2 * Math.random() - 1) * levelStats.buildingWidthDev;
            var buildingHeight = levelStats.stdBuildingHeight + (2 * Math.random() - 1) * levelStats.buildingHeightDev;
            var gapWidth = levelStats.stdGapWidth + (2 * Math.random() - 1) * levelStats.gapWidthDev;
            
            for (var col = 0; col < buildingWidth; col++) {
                for (var row = 0; row < buildingHeight; row++) {
                    var brick = this.bricks.create((buildingStartPos + col) * 32, (540/32 - row) * 32, "world1brick");
                    brick.setScale(32 / 256);
                    brick.refreshBody();
                }
            }
            
            buildingStartPos += buildingWidth + gapWidth;
        }
        var levelLength = buildingStartPos * 32;
        
        this.player = this.physics.add.sprite(69, 0, "rakesh");
        this.player.setGravityY(1200);
        this.physics.add.collider(this.player, this.bricks);
        
        this.physics.world.setBounds(0, 0, levelLength, 540);
        this.cameras.main.setBounds(0, 0, levelLength, 540);
        this.cameras.main.startFollow(this.player);
        
        this.cursors = this.input.keyboard.createCursorKeys(); // for testing movement only
        
    }

    update() {
        /*
        // for testing camera only
        if (this.cursors.left.isDown) {
            this.player.body.x-=10;
        }
        if (this.cursors.right.isDown) {
            this.player.body.x+=10;
        }
        if (this.cursors.up.isDown) {
            this.player.body.y-=10;
        }
        if (this.cursors.down.isDown) {
            this.player.body.y+=10;
        }*/
    }

}
