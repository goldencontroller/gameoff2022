class Boss3 extends Phaser.Scene {

    constructor() {
        super("boss3");
    }

    preload() {
        this.load.image("world1brick", "assets/image/world1brick.png");
        this.load.image("ball", "assets/image/round.png");
        this.load.image("rakesh", "assets/image/rameshravi.png");
        this.load.image("normalBaddie", "assets/image/badbean.png");
        this.load.spritesheet("srinathFlying", "assets/image/srinath2.png", { frameWidth: 40, frameHeight: 60 });
        this.load.image("portal", "assets/image/portal.png");
        this.load.audio("shotSound", "assets/sound/muzzle.wav");
        this.load.audio("brickHit", "assets/sound/brickbreak.wav");
        this.load.audio("enemyKill", "assets/sound/enemydeath.wav");
        this.load.audio("shotDeflect", "assets/sound/metalbounce.wav");
        this.load.audio("bossMusic", "assets/music/srinathTheme.wav");
        this.load.image("stars", "assets/image/starPattern.png");
    }

    create() {
        this.sound.stopAll();
        
        var graphics = this.add.graphics();
        graphics.fillGradientStyle(0x003c67, 0x003c67, 0x030030, 0x030030, 1);
        
        var levelStats = {
            stdBuildingWidth: 3,
            buildingWidthDev: 2,
            numBuildings: 12,
            stdGapWidth: 8,
            gapWidthDev: 4,
            stdBuildingHeight: 5,
            buildingHeightDev: 4,
            entityWeights: {
                sniperEnemy: 0.34,
                patrolEnemy: 0.42,
            },
        };
        
        this.bricks = this.physics.add.staticGroup();
        this.sniperEnemies = this.physics.add.group();
        this.patrolEnemies = this.physics.add.group();
        this.physics.add.collider(this.bricks, this.sniperEnemies);
        this.physics.add.collider(this.bricks, this.patrolEnemies);
        this.boss = this.physics.add.sprite(0, 0, "srinathFlying");
        this.bossAlive = true;
        //this.physics.add.collider(this.bricks, this.boss);
        var buildingStartPos = 2;
        for (var i = 0; i < levelStats.numBuildings; i++) {
            var buildingWidth = levelStats.stdBuildingWidth + Math.round((2 * Math.random() - 1) * levelStats.buildingWidthDev);
            var buildingHeight = levelStats.stdBuildingHeight + Math.round((2 * Math.random() - 1) * levelStats.buildingHeightDev);
            var gapWidth = levelStats.stdGapWidth + Math.round((2 * Math.random() - 1) * levelStats.gapWidthDev);
            
            for (var col = 0; col < buildingWidth; col++) {
                for (var row = 0; row < buildingHeight; row++) {
                    var brick = this.bricks.create((buildingStartPos + col) * 32, (540/32 - row) * 32, "world1brick");
                }
                
                if (i > 0 && i < levelStats.numBuildings - 1) {
                    var rN = Math.random();
                    if (rN < levelStats.entityWeights.sniperEnemy) {
                        if (i > 1) {
                            var sniperEnemy = this.sniperEnemies.create((buildingStartPos + col) * 32, 540 - buildingHeight * 32 - 15, "normalBaddie");
                            sniperEnemy.setGravityY(1200);
                        }
                    }
                    else if (rN < levelStats.entityWeights.patrolEnemy) {
                        if (col > 0 && col < buildingWidth - 1) {
                            var patrolEnemy = this.patrolEnemies.create((buildingStartPos + col) * 32, 540 - buildingHeight * 32 - 15, "normalBaddie");
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
        this.portal.actualY = this.portal.y;
        this.portal.setY(-6969);
        
        graphics.fillRect(0, 0, levelLength, 540);
        
        this.player = this.physics.add.sprite(69, -69, "rakesh");
        this.player.setGravityY(1200);
        this.player.setDragX(333);
        this.player.setDragY(333);
        this.physics.add.collider(this.player, this.bricks);
        this.stunFrames = 0;
        
        this.physics.world.setBounds(0, 0, levelLength, 540);
        this.cameras.main.setBounds(0, 0, levelLength, 540);
        this.cameras.main.startFollow(this.player);
        
        this.projectiles = this.physics.add.group();
        
        this.garbageDump = [];
        this.physics.add.overlap(this.projectiles, this.bricks, function(projectile, brick) {
            this.garbageDump.push(brick);
            this.garbageDump.push(projectile);
            if (!projectile.doNotHurtEnemies) game.scoreStats.propertyDamage += 690;
            var sound = this.sound.add("brickHit");
            sound.play();
        }.bind(this), null, this);
        this.physics.add.overlap(this.projectiles, this.sniperEnemies, function(projectile, enemy) {
            if (!projectile.doNotHurtEnemies) {
                this.garbageDump.push(projectile);
                this.garbageDump.push(enemy);
                game.scoreStats.kills++;
                var sound = this.sound.add("enemyKill");
                sound.play();
            }
        }.bind(this), null, this);
        this.physics.add.overlap(this.projectiles, this.patrolEnemies, function(projectile, enemy) {
            if (!projectile.doNotHurtEnemies) {
                this.garbageDump.push(projectile);
                this.garbageDump.push(enemy);
                game.scoreStats.kills++;
                var sound = this.sound.add("enemyKill");
                sound.play();
            }
        }.bind(this), null, this);
        this.physics.add.overlap(this.projectiles, this.player, function(player, projectile) {
            if (projectile.doNotHurtEnemies) {
                this.player.setVelocityX(projectile.body.velocity.x);
                this.player.setVelocityY(projectile.body.velocity.y);
                this.garbageDump.push(projectile);
                //this.stunFrames = 34;
            }
        }.bind(this), null, this);
        this.physics.add.overlap(this.patrolEnemies, this.player, function(player, enemy) {
            player.setVelocityX((enemy.body.velocity.x > 0)?1000:-1000);
            //this.stunFrames = 34;
        }.bind(this), null, this);
        
        this.physics.add.overlap(this.portal, this.player, function(player, portal) {
            this.scene.start("transition");
        }.bind(this), null, this);
        
        this.physics.add.overlap(this.projectiles, this.boss, function(boss, projectile) {
            if (!projectile.doNotHurtEnemies) {
                if (projectile.x > boss.x + 10) {
                    this.bossAlive = false;
                    this.garbageDump.push(projectile);
                }
                else {
                    projectile.doNotHurtEnemies = true;
                    projectile.rotation = Math.PI - projectile.rotation;
                    projectile.setVelocityX(Math.cos(projectile.rotation) * 1000);
                    projectile.setVelocityY(Math.sin(projectile.rotation) * 1000);
                    var sound = this.sound.add("shotDeflect");
                    sound.play();
                }
            }
        }.bind(this), null, this);
        
        this.physics.add.overlap(this.bricks, this.boss, function(boss, brick) {
            this.garbageDump.push(brick);
            var sound = this.sound.add("brickHit");
            sound.play();
        }.bind(this), null, this);
        
        this.cursors = this.input.keyboard.createCursorKeys(); // for testing movement only
        
        this.clicka = this.input.activePointer;
        this.canClick = false;
        
        this.internalClock = 0;
        
        this.music = this.sound.add("bossMusic");
        this.music.loop = true;
        this.music.play();
        
        for (var x = 0; x < levelLength + 1000; x += 960) {
            var starry = this.add.image(x, 0, "stars");
            starry.setOrigin(0, 0);
            starry.setDepth(0);
        }
        for (var m of [this.player,this.bricks,this.sniperEnemies,this.patrolEnemies,this.portal]) {
            m.setDepth(1);
        }
        
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
        
        if (this.clicka.isDown && this.canClick && this.player.y > 21 && this.stunFrames == 0) {
            this.canClick = false;
            var ball = this.projectiles.create(this.player.x, this.player.y, "ball");
            ball.rotation = Math.atan2(this.clicka.y - this.player.y, relClickX - this.player.x);
            ball.setVelocityX(Math.cos(ball.rotation) * 1000);
            ball.setVelocityY(Math.sin(ball.rotation) * 1000);
            this.player.setVelocityX(ball.body.velocity.x * -0.3);
            this.player.setVelocityY(ball.body.velocity.y * -0.3);
            var sound = this.sound.add("shotSound");
            sound.play();
        }
        else if (!this.clicka.isDown) {
            this.canClick = true;
        }
        
        this.player.flipX = relClickX < this.player.x;
        
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
                    var sound = this.sound.add("shotSound");
                    sound.play();
                }
            }
            enemy.flipX = enemy.x > this.player.x;
        }.bind(this));
        this.patrolEnemies.children.iterate(function(enemy) {
            enemy.setVelocityX(Math.cos(this.internalClock / 16) * 96);
            enemy.flipX = enemy.body.velocity.x < 0;
        }.bind(this));
        
        while (garbageDump.length > 0) {
            garbageDump.pop().destroy();
        }
        
        this.portal.rotation = this.internalClock / 9;
        
        if (this.player.y > 3690) this.scene.start("game-over");
        
        if (this.stunFrames > 0) this.stunFrames--;
        
        if (this.bossAlive) {
            if (this.player.x < this.levelLength - 690) {
                if (this.boss.x < this.player.x + 300) this.boss.x = this.player.x + 300;
                this.boss.y = 100 + 50 * Math.sin(this.internalClock / 69);
            }
            this.boss.flipX = true;
            this.boss.setTexture("srinathFlying", Math.floor(this.internalClock / 3) % 3);
        }
        else {
            this.boss.setTexture("srinathFlying", 3);
            this.boss.setGravityY(1200);
        }
        
        if (this.boss.y > 3690) this.portal.setY(this.portal.actualY);
        
        if (this.boss.y < 3690) {
            if (this.internalClock % 6 == 0 && Math.floor(this.internalClock / 180) % 4 == 3) {
                var ball = this.projectiles.create(this.boss.x, this.boss.y, "ball");
                ball.rotation = Math.atan2((this.player.y - 32) - this.boss.y, this.player.x - this.boss.x);
                ball.setVelocityX(Math.cos(ball.rotation) * 1000);
                ball.setVelocityY(Math.sin(ball.rotation) * 1000);
                ball.doNotHurtEnemies = true;
                var sound = this.sound.add("shotSound");
                sound.play();
            }
        }
        
        this.scene.stop("main-menu");
    }

}
