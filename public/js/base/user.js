const guestUser = {
    name: 'სტუმარი',
    lastTenRaces: [],
    allTimeAvg: 0,
    bestRace: 0,
    nRaces: 0,
    wonRaces: 0,
    rank: 'ოსტატი',
    level: 0
}

const User = {
    loggedIn: false,
    loggedInUser: {
        name: 'guest',
        lastTenRaces: [],
        allTimeAvg: 0,
        bestRace: 0,
        nRaces: 0,
        wonRaces: 0,
        rank: 'ოსტატი',
        level: 0
    },
    resetGuestUser () {
        this.loggedIn = false;
        this.loggedInUser = Object.assign(guestUser, {});
    }
}