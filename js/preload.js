var preload = function (game) {

};

preload.prototype = {
    preload: function () {
        var loadingText = this.add.text(this.world.centerX, this.world.centerY - 30, 'Loading', {
            font: '28px roboto_slabregular',
            fill: '#fff'
        });
        loadingText.anchor.setTo(0.5);

        this.loading = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
        this.loading.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.loading);

        this.load.image('shield', 'assets/images/reflector.png');
        this.load.image('redBullet', 'assets/images/red-bullet.png');
        this.load.image('blueBullet', 'assets/images/blue-bullet.png')
        this.load.image('enemy', 'assets/images/enemy.png');

        this.load.audio('hit', 'assets/audio/hit.wav');
        this.load.audio('music', 'assets/audio/music.mp3');
    },

    create: function () {
        this.loading.cropEnabled = false;
    },

    update: function () {
        if (this.cache.isSoundDecoded('music')) {
            this.state.start('GameStart');
        }
    }
}
