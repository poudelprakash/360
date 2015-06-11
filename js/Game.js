	/**
	* creating an instance of a Phaser.Game object and assigning to local variable game
	* param1 width
	* param2 height
	* param3 rendering context(webgl or canvas) auto means switches automatically
	* param5 id where game should be rendered
	*/
	var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'de-ghumake-game');

	var playState = {
		preload: function(){
			game.load.image('shield', 'assets/images/reflector.png');
		},

		create: function(){
			game.stage.backgroundColor = '#3498db';

			// add arcade physics
			game.physics.startSystem(Phaser.Physics.ARCADE);

			this.shield = game.add.sprite(game.world.centerX, game.world.centerY, 'shield');
			game.physics.arcade.enable(this.shield);

			this.shield.angle = 0;
			this.shield.radius = 70;

			// handle keyboard inputs
			this.cursor = game.input.keyboard.createCursorKeys();

		},

		update: function(){
			this.moveShield();
		},

		moveShield: function() {
		    // If the left arrow key is pressed
		    if (this.cursor.left.isDown) {
		        this.shield.angle -= 0.25;
		        this.shield.x = game.world.centerX + this.shield.radius* Math.cos(this.shield.angle);
		        this.shield.y = game.world.centerY + this.shield.radius* Math.sin(this.shield.angle);
		    }

		   // If the right arrow key is pressed
		   else if (this.cursor.right.isDown) {
		    		        this.shield.angle += 0.25;
		        this.shield.x = game.world.centerX + this.shield.radius* Math.cos(this.shield.angle);
		        this.shield.y = game.world.centerY + this.shield.radius* Math.sin(this.shield.angle);

		   }

		   // If neither the right or left arrow key is pressed
		   else {
		       // Stop the player
		   }

		},
	};

	game.state.add('playState', playState);
	game.state.start('playState');

