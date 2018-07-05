Module.module({
    name: 'default',
    scripts: [
        '/game.state.js',
        '/playground.js',
        '/home.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view () {
        switch (Router.innerRoute()){
            case 'friend':
            case 'practice':
            case 'world':
                PlayGround.init();
                return PlayGround.view();
            case '':
            default:
                return Home.view();
        }
    }
});