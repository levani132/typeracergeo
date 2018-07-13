Module.module({
    name: 'default',
    scripts: [
        '/game.state.js',
        '/playground.js',
        '/home.js',
        '/game.js',
        '/friend.game.js'
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view () {
        switch (Router.innerRoute()){
            case 'newgame':
                FriendGame.init();
                return FriendGame.view();
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