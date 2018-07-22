function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const guestUser = {
    name: 'სტუმარი',
    lastTenRaces: [],
    tenAvg: 0,
    allTimeAvg: 0,
    bestRace: 0,
    nRaces: 0,
    wonRaces: 0,
    rank: getRank(0),
    id: guid()
}

const User = {
    loggedIn: false,
    loggedInUser: Object.assign(guestUser, {}),
    resetGuestUser () {
        User.loggedIn = false;
        User.loggedInUser = Object.assign(guestUser, {});
    },
    addStatistics (player) {
        var update = () => {
            if(User.loggedInUser.lastTenRaces.length == 10){
                User.loggedInUser.lastTenRaces.splice(0, 1);
            }
            User.loggedInUser.lastTenRaces.push(player.speed);
            User.loggedInUser.allTimeAvg = Math.round(User.loggedInUser.allTimeAvg * User.loggedInUser.nRaces / (User.loggedInUser.nRaces + 1) + player.speed / (User.loggedInUser.nRaces + 1));
            User.loggedInUser.nRaces++;
            if(User.loggedInUser.bestRace < player.speed){
                User.loggedInUser.bestRace = player.speed;
            }
            if(player.place == 1){
                User.loggedInUser.wonRaces++;
            }
            User.loggedInUser.tenAvg = User.loggedInUser.lastTenRaces.length ? Math.round(User.loggedInUser.lastTenRaces.reduce((a, b) => a + b) / User.loggedInUser.lastTenRaces.length) : 0;
            User.loggedInUser.rank = getRank(User.loggedInUser.tenAvg);
            Header.refresh();
        }
        if (User.loggedIn) {
            Service.AddStatistics(player).then(update);
        }else{
            update();
        }
    }
}