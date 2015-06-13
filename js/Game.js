	/**
	*
	* creating an instance of a Phaser.Game object and assigning to local variable game
	*
	* @param1 width
	* @param2 height
	* @param3 rendering context(webgl or canvas) auto means switches automatically
	* @param5 id where game should be rendered
	*/
	var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'de-ghumake-game');

	var playState = {
		preload: function(){
			game.load.image('circle', 'assets/images/circle.png');
			game.load.image('shield', 'assets/images/reflector.png');
		},

		create: function(){
			this.timer = game.add.text(16, 16, '00:00', { fontSize: '32px', fill: '#000' });
			game.stage.backgroundColor = '#3498db';

			// add arcade physics
			game.physics.startSystem(Phaser.Physics.ARCADE);

			this.circle = game.add.sprite(game.world.centerX, game.world.centerY,'circle');
			this.circle.scale.x =0.123;
			this.circle.scale.y =0.123;
			this.circle.anchor.setTo(0.5,0.5);

			this.shield = game.add.sprite(game.world.centerX + 75, game.world.centerY, 'shield');
			game.physics.arcade.enable(this.shield);

			this.shield.angle = 0;
			this.shield.radius = 75;
			this.shield.scale.x = 0.5;
		    this.shield.scale.y = 0.5;
			this.shield.anchor.setTo(0.5,0.5);

			// handle keyboard inputs
			this.cursor = game.input.keyboard.createCursorKeys();
		},

		update: function(){
			this.moveShield();
			this.updateTimer();
		},

		updateTimer: function(){
				 var seconds = Math.floor(game.time.now / 1000) % 60;
				 var milliseconds = Math.floor(game.time.now) % 60;
				//If any of the digits becomes a single digit number, pad it with a zero
				if (milliseconds < 10)
					milliseconds = '0' + milliseconds;
				if (seconds < 10)
					seconds = '0' + seconds;
				this.timer.setText(seconds + ':'+ milliseconds);
		},

		moveShield: function() {
		    // If the left arrow key is pressed
		    if (this.cursor.left.isDown) {
		        this.shield.angle -= 0.25;
		        this.shield.x = game.world.centerX + this.shield.radius* Math.cos(this.shield.angle);
		        this.shield.y = game.world.centerY + this.shield.radius* Math.sin(this.shield.angle);
		        this.shield.rotation = this.game.physics.arcade.angleBetween(this.shield, this.circle);
		    }
		   // If the right arrow key is pressed
		   else if (this.cursor.right.isDown) {
	    		this.shield.angle += 0.25;
		        this.shield.x = game.world.centerX + this.shield.radius* Math.cos(this.shield.angle);
		        this.shield.y = game.world.centerY + this.shield.radius* Math.sin(this.shield.angle);
	         this.shield.rotation = this.game.physics.arcade.angleBetween(this.shield, this.circle);

		   }

		   // If neither the right or left arrow key is pressed
		   else {
		       // Stop the player
		   }

		}
	};

	game.state.add('playState', playState);
	game.state.start('playState');

