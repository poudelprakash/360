var preload = {
    preload: function () {
        game.load.image('shield', 'assets/images/reflector.png');
        game.load.image('redBullet', 'assets/images/red-bullet.png');
        game.load.image('blueBullet', 'assets/images/blue-bullet.png')
        game.load.image('enemy', 'assets/images/enemy.png');
        game.load.audio('hit', 'assets/audio/hit.wav');
    },
    create: function () {
        game.state.start('GameStart');
    }
}
