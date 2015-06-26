var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'de-ghumake-game');

var playState = {
    preload: function () {
        game.load.image('circle', 'assets/images/circle.png');
        game.load.image('shield', 'assets/images/reflector.png');
        game.load.image('redBullet', 'assets/images/red-bullet.png');
        game.load.image('blueBullet', 'assets/images/blue-bullet.png')
        game.load.image('enemy', 'assets/images/enemy.png');
    },

    create: function () {
        this.timer = game.add.text(16, 16, '00:00', {fontSize: '32px', fill: '#000'});

        this.score = 0;
        this.life = 10;
        this.spawnDelay = 1600;
        this.spawnTimer=game.time.time;

        game.stage.backgroundColor = '#3498db';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.circle = new Phaser.Circle(game.world.centerX, game.world.centerY, 75 * 2);
        this.circle = game.add.sprite(game.world.centerX, game.world.centerY, 'circle');
        this.circle.scale.x = 0.00123;
        this.circle.scale.y = 0.00123;
        this.circle.anchor.setTo(0.5, 0.5);

        this.enemies = game.add.group();
        this.redBullets = game.add.group();
        this.redBullets.enableBody = true;
        this.blueBullets = game.add.group();
        this.blueBullets.enableBody = true;

        this.shield = game.add.sprite(game.world.centerX + 75, game.world.centerY, 'shield');
        game.physics.arcade.enable(this.shield);

        this.shield.angle = 0;
        this.shield.radius = 75;
        this.shield.scale.x = 0.8;
        this.shield.scale.y = 0.8;
        this.shield.anchor.set(0.5, 0.5);

        this.rotation = 0;
        this.rotationSpeed = 0.18;

        this.generateEnemyPositions();

        // game.time.events.repeat(Phaser.Timer.SECOND * 1, 25, this.spawnEnemy, this);

        this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.moveShield();
        this.updateTimer();

        game.physics.arcade.overlap(this.shield, this.redBullets, this.reflectBack, null, this);
        game.physics.arcade.collide(this.blueBullets, this.enemies, this.deathHandler, null, this);

        this.checkMissedBullets();

        if (this.cursor.up.isDown || (this.game.time.time > this.spawnTimer)) {
            this.spawnEnemy();
        }





    },
    checkMissedBullets: function(){

    },

    deathHandler: function (blueBullet, enemy) {
        this.score++;
        console.log('score'+this.score);
        blueBullet.kill();
        enemy.kill();
    },

    generateEnemyPositions: function () {
        var enemyHeight = 20;
        this.enemyPositions = [
            [8 * enemyHeight, 3 * enemyHeight],
            [game.world.centerX, enemyHeight],
            [game.world.width - 2 * enemyHeight, 2 * enemyHeight],
            [enemyHeight, game.world.centerY],
            [game.world.width - 2 * enemyHeight, game.world.centerY],
            [enemyHeight, game.world.height - 2 * enemyHeight],
            [game.world.centerX, game.world.height - enemyHeight],
            [game.world.width - 2 * enemyHeight, game.world.height - enemyHeight]
        ]
    },

    spawnEnemy: function () {

        var enemyPosition = this.enemyPositions[game.rnd.integerInRange(0, 7)];
        var enemy = game.add.sprite(enemyPosition[0], enemyPosition[1], 'enemy');
        enemy.rotation = this.game.physics.arcade.angleBetween(enemy, this.circle);
        enemy.scale.x = 4;
        enemy.scale.y = 4;
        enemy.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(enemy);

        this.enemies.add(enemy);
        this.fireBullet(enemy);
        this.spawnTimer = this.game.time.time + this.spawnDelay;
    },

    clearEnemies: function(){
        this.enemies.destroy();
    },

    fireBullet: function (enemy) {
        var redBullet = game.add.sprite(enemy.x, enemy.y, 'redBullet');
        redBullet.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(redBullet);
        redBullet.rotation = game.physics.arcade.angleBetween(redBullet, this.circle);
        game.physics.arcade.moveToObject(redBullet, this.circle, 500);
        
        redBullet.events.onOutOfBounds.add( this.goodbye );

        this.redBullets.add(redBullet);
    },

// function that gets called when bullet goes out of sight
    goodbye: function(redBullet){
        console.log('ef');
        redBullet.kill();
        this.clearEnemies();
    },

    reflectBack: function (shield, redBullet) {
        redBullet.kill();
        var blueBullet = game.add.sprite(redBullet.position.x, redBullet.position.y, 'blueBullet');
        blueBullet.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(blueBullet);

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
    }
};

game.state.add('playState', playState);
game.state.start('playState');
