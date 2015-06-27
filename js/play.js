var play = {
    create: function () {
        this.score = 0;
        this.life = 10;
        this.spawnDelay = 1600;
        this.spawnTimer = game.time.time;
        this.enemyRadius = game.world.height / 2.2;
        this.timer = game.add.text(16, 16, '00:00', {
            font: '32px roboto_slabregular',
            fill: '#fff'
        });

        this.center = game.add.graphics(game.world.centerX, game.world.centerY);
        this.circle = game.add.graphics(game.world.centerX, game.world.centerY);
        this.circle.beginFill(0xbbada0, 1.0);
        this.circle.drawCircle(0, 0, 80);

        this.scoreText = game.add.text(game.world.centerX, game.world.centerY, '', {
            font: '32px roboto_slabregular',
            fill: '#fff'
        });
        this.scoreText.anchor.setTo(0.5);
        this.scoreText.align = 'center';

        this.hit = game.add.audio('hit');
        this.hit.volume = -0.3;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.enemies = game.add.group();
        this.redBullets = game.add.group();
        this.redBullets.enableBody = true;
        this.redBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.blueBullets = game.add.group();

        this.shield = game.add.sprite(game.world.centerX + 75, game.world.centerY, 'shield');
        game.physics.arcade.enable(this.shield);

        this.shield.angle = 0;
        this.shield.radius = 75;
        this.shield.scale.x = 0.8;
        this.shield.scale.y = 0.8;
        this.shield.anchor.setTo(0.5);

        this.rotation = 0;
        this.rotationSpeed = 0.18;

        this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.scoreText.setText(this.score);
        this.moveShield();
        this.updateTimer();

        game.physics.arcade.overlap(this.shield, this.redBullets, this.reflectBack, null, this);
        game.physics.arcade.collide(this.blueBullets, this.enemies, this.deathHandler, null, this);

        if (game.time.time > this.spawnTimer) {
            this.spawnEnemy();
        }
    },

    deathHandler: function (blueBullet, enemy) {
        this.score++;
        blueBullet.kill();
        enemy.kill();
    },

    spawnEnemy: function () {
        this.clearEnemies();

        var enemyPosition = this.circlePoints(this.enemyRadius);
        var enemy = game.add.sprite(enemyPosition.x, enemyPosition.y, 'enemy');
        enemy.rotation = game.physics.arcade.angleBetween(enemy, this.center);
        enemy.scale.x = 3.5;
        enemy.scale.y = 3.5;
        enemy.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(enemy);

        this.enemies.add(enemy);
        this.fireBullet(enemy);
        this.spawnTimer = game.time.time + this.spawnDelay;
    },

    clearEnemies: function () {
        if (this.redBullets.length > 0) {
            this.redBullets.forEach(function (bullet) {
                bullet.kill();
            }, this);
        }
        if (this.enemies.length >= 1) {
            this.enemies.forEach(function (enemy) {
                enemy.kill();
            }, this);
        }

    },

    fireBullet: function (enemy) {
        var redBullet = game.add.sprite(enemy.x, enemy.y, 'redBullet');
        redBullet.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(redBullet);
        redBullet.rotation = game.physics.arcade.angleBetween(redBullet, this.center);
        game.physics.arcade.moveToObject(redBullet, this.center, 500);
        this.redBullets.add(redBullet);
    },

    reflectBack: function (shield, redBullet) {
        redBullet.kill();
        this.hit.play();

        var blueBullet = game.add.sprite(redBullet.position.x, redBullet.position.y, 'blueBullet');
        game.physics.arcade.enable(blueBullet);

        blueBullet.anchor.setTo(0.5, 0.5);
        blueBullet.rotation = redBullet.rotation;
        blueBullet.body.velocity.x = -2 * redBullet.body.velocity.x;
        blueBullet.body.velocity.y = -2 * redBullet.body.velocity.y;

        this.blueBullets.add(blueBullet);
    },

    updateTimer: function () {
        var seconds = Math.floor(game.time.now / 1000) % 60;
        var milliseconds = Math.floor(game.time.now) % 60;

        if (milliseconds < 10) milliseconds = '0' + milliseconds;
        if (seconds < 10) seconds = '0' + seconds;
        this.timer.setText(seconds + ':' + milliseconds);
    },

    moveShield: function () {
        if (this.cursor.left.isDown) {
            this.shield.rotation = this.rotation + Math.PI / 2;

            this.shield.x = game.world.centerX + Math.cos(this.rotation) * ( this.shield.radius + this.shield.height / 2 );
            this.shield.y = game.world.centerY + Math.sin(this.rotation) * ( this.shield.radius + this.shield.height / 2 );

            this.rotation -= this.rotationSpeed;
        }
        else if (this.cursor.right.isDown) {
            this.shield.rotation = this.rotation + Math.PI / 2;

            this.shield.x = game.world.centerX + Math.cos(this.rotation) * ( this.shield.radius + this.shield.height / 2 );
            this.shield.y = game.world.centerY + Math.sin(this.rotation) * ( this.shield.radius + this.shield.height / 2 );

            this.rotation += this.rotationSpeed;
        }
        else {
            this.shield.rotation = this.rotation + Math.PI / 2;
        }
    },

    circlePoints: function (radius) {
        var angle = game.rnd.integerInRange(0, 360);
        var x = radius * Math.cos(game.math.degToRad(angle)) + game.world.centerX;
        var y = radius * Math.sin(game.math.degToRad(angle)) + game.world.centerY;

        return {
            x: x,
            y: y
        };
    }
};
