var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'de-ghumake-game');

var playState = {
    preload: function () {
        game.load.image('circle', 'assets/images/circle.png');
        game.load.image('shield', 'assets/images/reflector.png');
        game.load.image('bullet', 'assets/images/bullet.png');
        game.load.image('enemy', 'assets/images/enemy.png');
    },

    create: function () {
        this.circle = new Phaser.Circle(game.world.centerX, game.world.centerY, 75 * 2);
        this.timer = game.add.text(16, 16, '00:00', {fontSize: '32px', fill: '#000'});

        game.stage.backgroundColor = '#3498db';

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.circle = game.add.sprite(game.world.centerX, game.world.centerY, 'circle');
        this.circle.scale.x = 0.123;
        this.circle.scale.y = 0.123;
        this.circle.anchor.setTo(0.5, 0.5);

        this.enemies = game.add.group();
        this.bullets = game.add.group();

        this.shield = game.add.sprite(game.world.centerX + 75, game.world.centerY, 'shield');
        game.physics.arcade.enable(this.shield);

        this.shield.angle = 0;
        this.shield.radius = 75;
        this.shield.scale.x = 0.6;
        this.shield.scale.y = 0.6;
        this.shield.anchor.set(0.2);

        this.rotation = 0;
        this.rotationSpeed = 0.18;

        this.generateEnemyPositions();

        this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.moveShield();
        this.updateTimer();

        game.physics.arcade.overlap(this.shield, this.bullet, this.reflectBack, null, this);

        if (this.cursor.up.isDown) {
            this.spawnEnemy();
        }
    },
    generateEnemyPositions: function(){
        var enemyHeight = 20;
        this.enemyPositions = [
        [8*enemyHeight, 3*enemyHeight],[game.world.centerX, enemyHeight], [game.world.width-2*enemyHeight, 2*enemyHeight],
        [enemyHeight, game.world.centerY], [game.world.width-2*enemyHeight, game.world.centerY],
        [enemyHeight,game.world.height-2*enemyHeight], [game.world.centerX, game.world.height-enemyHeight],  [game.world.width-2*enemyHeight, game.world.height-enemyHeight]
        ]
    },

    spawnEnemy: function(){
        var enemyPosition = this.enemyPositions[game.rnd.integerInRange(0,7)];
        var enemy = game.add.sprite(enemyPosition[0], enemyPosition[1],'enemy');
        enemy.rotation = this.game.physics.arcade.angleBetween(enemy, this.circle);
        enemy.scale.x = 4;
        enemy.scale.y = 4;
        this.enemies.add(enemy);
        this.fireBullet(enemy);
    },

    fireBullet: function(enemy){
            var enemy = enemy;
            var bullet =  game.add.sprite(enemy.x, enemy.y, 'bullet');
            game.physics.arcade.enable(bullet);
            bullet.rotation = game.physics.arcade.angleBetween(bullet, this.circle);
            game.physics.arcade.moveToObject(bullet, this.circle, 400);
            this.bullets.add(bullet);        
    },

    reflectBack: function (shield, bullet) {
        this.bullet.body.velocity.x = -2 * bullet.body.velocity.x;
        this.bullet.body.velocity.y = -2 * bullet.body.velocity.y;
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

    toRadians: function (angle) {
        return angle * (Math.PI / 180);
    }
};

game.state.add('playState', playState);
game.state.start('playState');
