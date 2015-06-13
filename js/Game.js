var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'de-ghumake-game');

var playState = {
    preload: function () {
        game.load.image('circle', 'assets/images/circle.png');
        game.load.image('shield', 'assets/images/reflector.png');
        game.load.image('bullet', 'assets/images/bullet.png');
    },

    create: function () {
        game.stage.backgroundColor = '#3498db';

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.circle = game.add.sprite(game.world.centerX, game.world.centerY, 'circle');
        this.circle.scale.x = 0.123;
        this.circle.scale.y = 0.123;
        this.circle.anchor.setTo(0.5, 0.5);

        this.shield = game.add.sprite(game.world.centerX + 50, game.world.centerY, 'shield');
        game.physics.arcade.enable(this.shield);

        this.shield.angle = 0;
        this.shield.radius = 75;
        this.shield.scale.x = 0.5;
        this.shield.scale.y = 0.5;
        this.shield.anchor.setTo(0.5, 0.5);

        var circle = this.circlePoints(180);
        this.bullet = game.add.sprite(circle.x, circle.y, 'bullet');
        game.physics.arcade.enable(this.bullet);
        this.bullet.rotation = game.physics.arcade.angleBetween(this.bullet, this.circle);
        game.physics.arcade.moveToObject(this.bullet, this.circle, 250);

        this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.moveShield();
        var collide = game.physics.arcade.collide(this.bullet, this.shield);
    },

    moveShield: function () {
        // If the left arrow key is pressed
        if (this.cursor.left.isDown) {
            this.shield.angle -= 0.25;
            this.shield.x = game.world.centerX + this.shield.radius * Math.cos(this.shield.angle);
            this.shield.y = game.world.centerY + this.shield.radius * Math.sin(this.shield.angle);
            this.shield.rotation = this.game.physics.arcade.angleBetween(this.shield, this.circle);
        }
        // If the right arrow key is pressed
        else if (this.cursor.right.isDown) {
            this.shield.angle += 0.25;
            this.shield.x = game.world.centerX + this.shield.radius * Math.cos(this.shield.angle);
            this.shield.y = game.world.centerY + this.shield.radius * Math.sin(this.shield.angle);
            this.shield.rotation = this.game.physics.arcade.angleBetween(this.shield, this.circle);
        }

        // If neither the right or left arrow key is pressed
        else {
            // Stop the player
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
