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
        this.sniperEnemies = this.physics.add.group();
        this.physics.add.collider(this.bricks, this.sniperEnemies);
        var buildingStartPos = 2;
        for (var i = 0; i < levelStats.numBuildings; i++) {
            var buildingWidth = levelStats.stdBuildingWidth + Math.round((2 * Math.random() - 1) * levelStats.buildingWidthDev);
            var buildingHeight = levelStats.stdBuildingHeight + Math.round((2 * Math.random() - 1) * levelStats.buildingHeightDev);
            var gapWidth = levelStats.stdGapWidth + Math.round((2 * Math.random() - 1) * levelStats.gapWidthDev);
            
            for (var col = 0; col < buildingWidth; col++) {
                for (var row = 0; row < buildingHeight; row++) {
                    var brick = this.bricks.create((buildingStartPos + col) * 32, (540/32 - row) * 32, "world1brick");
                    brick.setScale(32 / 256);
                    brick.refreshBody();
                }
                
                if (i > 0) {
                    var rN = Math.random();
                    if (rN < 0.210) {
                        var sniperEnemy = this.sniperEnemies.create((buildingStartPos + col) * 32, 540 - buildingHeight * 32, "normalBaddie");
                        sniperEnemy.setGravityY(1200);
                    }
                }
            }
            
            buildingStartPos += buildingWidth + gapWidth;
        }
        var levelLength = buildingStartPos * 32;
        this.levelLength = levelLength;
        
        graphics.fillRect(0, 0, levelLength, 540);
        
        this.player = this.physics.add.sprite(69, -69, "rakesh");
        this.player.setGravityY(1200);
        this.player.setDragX(333);
        this.player.setDragY(333);
        this.physics.add.collider(this.player, this.bricks);
        
        this.physics.world.setBounds(0, 0, levelLength, 540);
        this.cameras.main.setBounds(0, 0, levelLength, 540);
        this.cameras.main.startFollow(this.player);
        
        this.projectiles = this.physics.add.group();
        
        this.garbageDump = [];
        this.physics.add.overlap(this.projectiles, this.bricks, function(brick, projectile) {
            this.garbageDump.push(brick);
            this.garbageDump.push(projectile);
        }.bind(this), null, this);
        this.physics.add.overlap(this.projectiles, this.sniperEnemies, function(projectile, enemy) {
            this.garbageDump.push(projectile);
            this.garbageDump.push(enemy);
        }.bind(this), null, this);
        
        this.cursors = this.input.keyboard.createCursorKeys(); // for testing movement only
        
        this.clicka = this.input.activePointer;
        this.canClick = false;
        
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
        
        var relClickX = this.clicka.x + this.cameras.main.scrollX;
        
        if (this.clicka.isDown && this.canClick && this.player.y > 21) {
            this.canClick = false;
            var ball = this.projectiles.create(this.player.x, this.player.y, "ball");
            ball.rotation = Math.atan2(this.clicka.y - this.player.y, relClickX - this.player.x);
            ball.setVelocityX(Math.cos(ball.rotation) * 1000);
            ball.setVelocityY(Math.sin(ball.rotation) * 1000);
            this.player.setVelocityX(ball.body.velocity.x * -0.3);
            this.player.setVelocityY(ball.body.velocity.y * -0.3);
        }
        else if (!this.clicka.isDown) {
            this.canClick = true;
        }
        
        var garbageDump = this.garbageDump;
        this.projectiles.children.iterate(function(ball) {
            if (ball.x < 0 || ball.y < 0 || ball.y > 540 || ball.x > this.levelLength) {
                garbageDump.push(ball);
            }
        }.bind(this));
        
        while (garbageDump.length > 0) {
            garbageDump.pop().destroy();
        }
    }

}
