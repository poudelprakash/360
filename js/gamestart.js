var gameStart = {
    preload: function () {
        game.stage.backgroundColor = '#8f7a66';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.setScreenSize();
        game.scale.refresh();
    },
    create: function () {
        game.state.start('Play');
    }
}
