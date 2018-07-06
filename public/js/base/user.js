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
    level: 0,
    id: guid()
}

const User = {
    loggedIn: false,
    loggedInUser: Object.assign(guestUser, {}),
    resetGuestUser () {
        this.loggedIn = false;
        this.loggedInUser = Object.assign(guestUser, {});
    },
    addStatistics (player) {
        if (this.loggedIn) {
            Service.AddStatistics(player);
        }
        if(this.loggedInUser.lastTenRaces.length == 10){
            this.loggedInUser.lastTenRaces.splice(0, 1);
        }
        this.loggedInUser.lastTenRaces.push(player.speed);
        this.loggedInUser.allTimeAvg = Math.round(this.loggedInUser.allTimeAvg * this.loggedInUser.nRaces / (this.loggedInUser.nRaces + 1) + player.speed / (this.loggedInUser.nRaces + 1));
        this.loggedInUser.nRaces++;
        if(this.loggedInUser.bestRace < player.speed){
            this.loggedInUser.bestRace = player.speed;
        }
        if(player.place == 1){
            this.loggedInUser.wonRaces++;
        }
        this.loggedInUser.tenAvg = this.loggedInUser.lastTenRaces.length ? Math.round(this.loggedInUser.lastTenRaces.reduce((a, b) => a + b) / this.loggedInUser.lastTenRaces.length) : 0;
        this.loggedInUser.rank = getRank(this.loggedInUser.tenAvg);
        Header.refresh();
    }
}