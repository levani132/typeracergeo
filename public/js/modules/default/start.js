Module.module({
    name: 'default',
    scripts: [
        '/game.state.js',
        '/playground.js',
        '/home.js',
        '/game.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view () {
        switch (Router.innerRoute()){
            case 'friend':
                if (Router.idRoute() != "") {
                    PlayGround.init();
                    return PlayGround.view();
                } else {
                    FriendGame.init();
                    return FriendGame.view();
                }
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