const ZERO_GAME = 0, 
        NEW_GAME = 1, 
        STARTED_NEW_GAME = 2, 
        STARTED_GAME = 3, 
        ENDED_FOR_ME = 4, 
        ENDED_GAME = 5;

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