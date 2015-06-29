var gameOver = function (game) {

};

gameOver.prototype = {
    init: function (score) {
        this.score = score;
    },

    create: function () {
        var circle = this.add.graphics(this.world.centerX, this.world.centerY);
        circle.beginFill(0xbbada0, 1.0);
        circle.drawCircle(0, 0, 80);

        var scoreText = this.add.text(this.world.centerX, this.world.centerY, '', {
            font: '32px roboto_slabregular',
            fill: '#fff'
        });
        scoreText.anchor.setTo(0.5);
        scoreText.align = 'center';
        scoreText.setText(this.score);

        var finalScoreText = this.add.text(this.world.centerX, this.world.centerY - 70, 'Final Score', {
            font: '34px roboto_slabregular',
            fill: '#fff'
        });
        finalScoreText.anchor.setTo(0.5);
        finalScoreText.align = 'center';

        var playAgainText = this.add.text(this.world.centerX, this.world.centerY + 100, 'Play Again?', {
            font: '40px roboto_slabregular',
            fill: '#edc53f'
        });
        playAgainText.anchor.setTo(0.5);
        playAgainText.align = 'center';
        playAgainText.inputEnabled = true;
        playAgainText.input.useHandCursor = true;
        playAgainText.events.onInputDown.add(function () {
            this.state.start('Play');
        }, this);
    }
}
