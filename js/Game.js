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
			game.load.image('player', 'assets/images/reflector.png');
		},

		create: function(){
			game.stage.backgroundColor = '#3498db';

			// add arcade physics
			game.physics.startSystem(Phaser.Physics.ARCADE);

			// add player
			this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
			game.physics.arcade.enable(this.player);
			// Set the anchor point to the bottom left of the sprite
			this.player.anchor.setTo(0, 1);

			this.cursor = game.input.keyboard.createCursorKeys();

		},

		update: function(){
			this.movePlayer();

		},

		movePlayer: function() {
		    // If the left arrow key is pressed
		    if (this.cursor.left.isDown) {
		        // Move the player to the left
		        this.player.body.velocity.x = -200;
		    }

		   // If the right arrow key is pressed
		   else if (this.cursor.right.isDown) {
		       // Move the player to the right
		       this.player.body.velocity.x = 200;
		   }

		   // If neither the right or left arrow key is pressed
		   else {
		       // Stop the player
		       this.player.body.velocity.x = 0;
		   }

		},
	};

	game.state.add('playState', playState);
	game.state.start('playState');

