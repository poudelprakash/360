var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'de-ghumake-game');

var playState = {
    preload: function () {
        game.load.image('circle', 'assets/images/circle.png');
        game.load.image('shield', 'assets/images/reflector.png');
        game.load.image('bullet', 'assets/images/bullet.png');
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

        this.shield = game.add.sprite(game.world.centerX + 75, game.world.centerY, 'shield');
        game.physics.arcade.enable(this.shield);

        this.shield.angle = 0;
        this.shield.radius = 75;
        this.shield.scale.x = 0.6;
        this.shield.scale.y = 0.6;
        this.shield.anchor.set(0.2);

        this.rotation = 0;
        this.rotationSpeed = 0.18;

        var circle = this.circlePoints(180);
        this.bullet = game.add.sprite(circle.x, circle.y, 'bullet');
        game.physics.arcade.enable(this.bullet);
        this.bullet.rotation = game.physics.arcade.angleBetween(this.bullet, this.circle);
        game.physics.arcade.moveToObject(this.bullet, this.circle, 400);

        this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.moveShield();
        this.updateTimer();

        game.physics.arcade.overlap(this.shield, this.bullet, this.reflectBack, null, this);
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

    bullet: function () {

    },

    circlePoints: function (radius) {
        var angle = this.getRandom(0, 360);
        var x = radius * Math.cos(this.toRadians(angle)) + game.world.centerX;
        var y = radius * Math.sin(this.toRadians(angle)) + game.world.centerY;

        return {
            x: x,
            y: y
        };
    },

    getRandom: function (min, max) {
        var value = Math.floor(Math.random() * (max - min + 1)) + min;
        return value ? value : this.getRandom(min, max);
    },

    toRadians: function (angle) {
        return angle * (Math.PI / 180);
    }
};

game.state.add('playState', playState);
game.state.start('playState');
