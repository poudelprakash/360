var gameStart = function (game) {

};

gameStart.prototype = {
    create: function () {
        this.music = this.add.audio('music');
        this.music.play();

        var playButton = this.add.text(this.world.centerX, this.world.centerY, 'Play', {
            font: "40px roboto_slabregular",
            fill: '#fff'
        });
        playButton.anchor.setTo(0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(function () {
            this.state.start('Play');
        }, this);
    }
}
