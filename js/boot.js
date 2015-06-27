var boot = function (game) {

};

boot.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.stage.backgroundColor = '#8f7a66';

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize();
    },

    preload: function () {
        this.load.image('loading', 'assets/images/loading.png');
    },

    create: function () {
        this.state.start('Preload');
    }
}
