var play = function (game) {

};

play.prototype = {
    create: function () {
        this.score = 0;
        this.life = 10;
        this.spawnDelay = 1600;
        this.spawnTimer = this.time.time;
        this.enemyRadius = this.world.height / 2.2;
        this.timer = this.add.text(16, 16, '00:00', {
            font: '32px roboto_slabregular',
            fill: '#fff'
        });

        this.center = this.add.graphics(this.world.centerX, this.world.centerY);
        this.circle = this.add.graphics(this.world.centerX, this.world.centerY);
        this.circle.beginFill(0xbbada0, 1.0);
        this.circle.drawCircle(0, 0, 80);

        this.scoreText = this.add.text(this.world.centerX, this.world.centerY, '', {
            font: '32px roboto_slabregular',
            fill: '#fff'
        });
        this.scoreText.anchor.setTo(0.5);
        this.scoreText.align = 'center';

        this.hit = this.add.audio('hit');
        this.hit.volume = -0.3;

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.enemies = this.add.group();
        this.redBullets = this.add.group();
        this.redBullets.enableBody = true;
        this.redBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.blueBullets = this.add.group();

        this.shield = this.add.sprite(this.world.centerX + 75, this.world.centerY, 'shield');
        this.physics.arcade.enable(this.shield);

        this.shield.angle = 0;
        this.shield.radius = 75;
        this.shield.scale.x = 0.8;
        this.shield.scale.y = 0.8;
        this.shield.anchor.setTo(0.5, 0.5);

        this.rotation = 0;
        this.rotationSpeed = 0.20;

        this.cursor = this.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.scoreText.setText(this.score);
        this.moveShield();
        this.updateTimer();

        this.physics.arcade.overlap(this.shield, this.redBullets, this.reflectBack, null, this);
        this.physics.arcade.collide(this.blueBullets, this.enemies, this.deathHandler, null, this);

        if (this.time.time > this.spawnTimer) {
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
        var enemy = this.add.sprite(enemyPosition.x, enemyPosition.y, 'enemy');
        enemy.rotation = this.physics.arcade.angleBetween(enemy, this.center);
        enemy.scale.x = 3.5;
        enemy.scale.y = 3.5;
        enemy.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(enemy);

        this.enemies.add(enemy);
        this.fireBullet(enemy);
        this.spawnTimer = this.time.time + this.spawnDelay;
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
        var redBullet = this.add.sprite(enemy.x, enemy.y, 'redBullet');
        redBullet.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(redBullet);
        redBullet.rotation = this.physics.arcade.angleBetween(redBullet, this.center);
        this.physics.arcade.moveToObject(redBullet, this.center, 500);
        this.redBullets.add(redBullet);
    },

    reflectBack: function (shield, redBullet) {
        redBullet.kill();
        this.hit.play();

        var blueBullet = this.add.sprite(redBullet.position.x, redBullet.position.y, 'blueBullet');
        this.physics.arcade.enable(blueBullet);

        blueBullet.anchor.setTo(0.5, 0.5);
        blueBullet.rotation = redBullet.rotation;
        blueBullet.body.velocity.x = -2 * redBullet.body.velocity.x;
        blueBullet.body.velocity.y = -2 * redBullet.body.velocity.y;

        this.blueBullets.add(blueBullet);
    },

    updateTimer: function () {
        var seconds = Math.floor(this.time.now / 1000) % 60;
        var milliseconds = Math.floor(this.time.now) % 60;

        if (milliseconds < 10) milliseconds = '0' + milliseconds;
        if (seconds < 10) seconds = '0' + seconds;
        this.timer.setText(seconds + ':' + milliseconds);
    },

    moveShield: function () {
        if (this.cursor.left.isDown) {
            this.shield.rotation = this.rotation + Math.PI / 2;

            this.shield.x = this.world.centerX + Math.cos(this.rotation) * ( this.shield.radius + this.shield.height / 2 );
            this.shield.y = this.world.centerY + Math.sin(this.rotation) * ( this.shield.radius + this.shield.height / 2 );

            this.rotation -= this.rotationSpeed;
        }
        else if (this.cursor.right.isDown) {
            this.shield.rotation = this.rotation + Math.PI / 2;

            this.shield.x = this.world.centerX + Math.cos(this.rotation) * ( this.shield.radius + this.shield.height / 2 );
            this.shield.y = this.world.centerY + Math.sin(this.rotation) * ( this.shield.radius + this.shield.height / 2 );

            this.rotation += this.rotationSpeed;
        }
        else {
            this.shield.rotation = this.rotation + Math.PI / 2;
        }
    },

    circlePoints: function (radius) {
        var angle = this.rnd.integerInRange(0, 360);
        var x = radius * Math.cos(this.math.degToRad(angle)) + this.world.centerX;
        var y = radius * Math.sin(this.math.degToRad(angle)) + this.world.centerY;

        return {
            x: x,
            y: y
        };
    }
};
