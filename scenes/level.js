class Level extends Phaser.Scene {

    constructor() {
        super("level");
    }

    preload() {
        this.load.image("world1brick", "assets/image/world1brick.png");
        this.load.image("ball", "assets/image/round.png");
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
        
        switch (Math.floor((game.levelOn - 1) / 3) + 1) {
            case 2:
                levelStats.stdBuildingWidth = 6;
                levelStats.buildingWidthDev = 4;
                levelStats.numBuildings = 15;
                levelStats.stdGapWidth = 5;
                levelStats.gapWidthDev = 2;
                levelStats.stdBuildingHeight = 6;
                levelStats.buildingHeightDev = 4;
                graphics.fillGradientStyle(0xc23400, 0xc23400, 0xcaab3d, 0xcaab3d, 1);
                break;
            case 3:
                levelStats.stdBuildingWidth = 7;
                levelStats.buildingWidthDev = 6;
                levelStats.numBuildings = 18;
                levelStats.stdGapWidth = 7;
                levelStats.gapWidthDev = 4;
                levelStats.stdBuildingHeight = 9;
                levelStats.buildingHeightDev = 6;
                graphics.fillGradientStyle(0x003c67, 0x003c67, 0x030030, 0x030030, 1);
                break;
        }
        
        this.bricks = this.physics.add.staticGroup();
        this.sniperEnemies = this.physics.add.group();
        this.patrolEnemies = this.physics.add.group();
        this.physics.add.collider(this.bricks, this.sniperEnemies);
        this.physics.add.collider(this.bricks, this.patrolEnemies);
        var buildingStartPos = 2;
        for (var i = 0; i < levelStats.numBuildings; i++) {
            var buildingWidth = levelStats.stdBuildingWidth + Math.round((2 * Math.random() - 1) * levelStats.buildingWidthDev);
            var buildingHeight = levelStats.stdBuildingHeight + Math.round((2 * Math.random() - 1) * levelStats.buildingHeightDev);
            var gapWidth = levelStats.stdGapWidth + Math.round((2 * Math.random() - 1) * levelStats.gapWidthDev);
            
            for (var col = 0; col < buildingWidth; col++) {
                for (var row = 0; row < buildingHeight; row++) {
                    var brick = this.bricks.create((buildingStartPos + col) * 32, (540/32 - row) * 32, "world1brick");
                }
                
                if (i > 0) {
                    var rN = Math.random();
                    if (rN < 0.12) {
                        var sniperEnemy = this.sniperEnemies.create((buildingStartPos + col) * 32, 540 - buildingHeight * 32, "normalBaddie");
                        sniperEnemy.setGravityY(1200);
                    }
                    else if (rN < 0.21) {
                        if (col > 0 && col < buildingWidth - 1) {
                            var patrolEnemy = this.patrolEnemies.create((buildingStartPos + col) * 32, 540 - buildingHeight * 32, "normalBaddie");
                            patrolEnemy.setGravityY(1200);
                        }
                    }
                }
            }
            
            buildingStartPos += buildingWidth + gapWidth;
        }
        var levelLength = buildingStartPos * 32;
        this.levelLength = levelLength;
        
        this.portal = this.physics.add.image(levelLength - (gapWidth + 2) * 32, 540 - (buildingHeight + 2) * 32, "portal");
        
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
        this.physics.add.overlap(this.projectiles, this.bricks, function(projectile, brick) {
            this.garbageDump.push(brick);
            this.garbageDump.push(projectile);
            if (!projectile.doNotHurtEnemies) game.scoreStats.propertyDamage += 690;
        }.bind(this), null, this);
        this.physics.add.overlap(this.projectiles, this.sniperEnemies, function(projectile, enemy) {
            if (!projectile.doNotHurtEnemies) {
                this.garbageDump.push(projectile);
                this.garbageDump.push(enemy);
                game.scoreStats.kills++;
            }
        }.bind(this), null, this);
        this.physics.add.overlap(this.projectiles, this.patrolEnemies, function(projectile, enemy) {
            if (!projectile.doNotHurtEnemies) {
                this.garbageDump.push(projectile);
                this.garbageDump.push(enemy);
                game.scoreStats.kills++;
            }
        }.bind(this), null, this);
        this.physics.add.overlap(this.projectiles, this.player, function(player, projectile) {
            if (projectile.doNotHurtEnemies) {
                this.player.setVelocityX(projectile.body.velocity.x * 0.69);
                this.player.setVelocityY(projectile.body.velocity.y * 0.69);
                this.garbageDump.push(projectile);
            }
        }.bind(this), null, this);
        this.physics.add.overlap(this.patrolEnemies, this.player, function(player, enemy) {
            player.setVelocityX(enemy.body.velocity.x * 20);
        }.bind(this), null, this);
        
        this.physics.add.overlap(this.portal, this.player, function(player, portal) {
            this.scene.start("transition");
        }.bind(this), null, this);
        
        this.cursors = this.input.keyboard.createCursorKeys(); // for testing movement only
        
        this.clicka = this.input.activePointer;
        this.canClick = false;
        
        this.internalClock = 0;
        
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
        
        this.internalClock++;
        
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
        this.sniperEnemies.children.iterate(function(enemy) {
            if (Math.abs(enemy.x - this.player.x) < 456) {
                if (this.internalClock % 34 == 0) {
                    var ball = this.projectiles.create(enemy.x, enemy.y, "ball");
                    ball.rotation = Math.atan2((this.player.y - 32) - enemy.y, this.player.x - enemy.x);
                    ball.setVelocityX(Math.cos(ball.rotation) * 1000);
                    ball.setVelocityY(Math.sin(ball.rotation) * 1000);
                    ball.doNotHurtEnemies = true;
                }
            }
        }.bind(this));
        this.patrolEnemies.children.iterate(function(enemy) {
            enemy.setVelocityX(Math.cos(this.internalClock / 16) * 96);
        }.bind(this));
        
        while (garbageDump.length > 0) {
            garbageDump.pop().destroy();
        }
        
        this.portal.rotation = this.internalClock / 9;
        
        if (this.player.y > 3690) this.scene.start("game-over");
    }

}
