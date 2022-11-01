class Level extends Phaser.Scene {

    constructor() {
        super("level");
    }

    preload() {
        this.load.image("world1brick", "assets/image/world1brick.png");
    }

    create() {
        var levelStats = {
            stdBuildingWidth: 10,
            buildingWidthDev: 3,
            numBuildings: 12,
            stdGapWidth: 3,
            gapWidthDev: 1,
            stdBuildingHeight: 5,
            buildingHeightDev: 2,
        };
        
        this.bricks = this.physics.add.group();
        var buildingStartPos = 2;
        for (var i = 0; i < levelStats.numBuildings; i++) {
            var buildingWidth = levelStats.stdBuildingWidth + (2 * Math.random() - 1) * levelStats.buildingWidthDev;
            var buildingHeight = levelStats.stdBuildingHeight + (2 * Math.random() - 1) * levelStats.buildingHeightDev;
            var gapWidth = levelStats.stdGapWidth + (2 * Math.random() - 1) * levelStats.gapWidthDev;
            
            for (var col = 0; col < buildingWidth; col++) {
                for (var row = 0; row < buildingHeight; row++) {
                    var brick = this.bricks.create((buildingStartPos + col) * 32, (540/32 - row) * 32, "world1brick");
                    brick.setScale(32 / 256);
                }
            }
            
            buildingStartPos += buildingWidth + gapWidth;
        }
        
        
        
    }

    update() {
        
    }

}
