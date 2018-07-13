const Service = {
    domain: '',
    request (url, data, method) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() { 
                if (xhr.readyState == 4 && xhr.status == 200)
                    resolve(xhr.responseText[0] == '{' ? JSON.parse(xhr.responseText) : xhr.responseText);
                else if (xhr.readyState == 4 && xhr.status != 200)
                    reject(xhr.response);
            }
            xhr.open(method, url, true); // true for asynchronous
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
            xhr.send(JSON.stringify(data));
        });
    },
    get (url, data) {
        return this.request(url, data, 'GET');
    },
    post (url, data) {
        return this.request(url, data, 'POST');
    },
    GetLoggedInUser () {
        var self = this;
        return new Promise((resolve, reject) => {
            self.get (this.domain + '/GetLoggedInUser').then((loggedInUser) => {
                User.loggedInUser = loggedInUser;
                // Temporary
                User.resetGuestUser();
                // ---
                resolve();
            }).catch(reject);
        });
    },
    GetRandomText () {
        var self = this;
        return new Promise((resolve, reject) => {
            self.get (this.domain + '/GetRandomText').then((text) => {
                resolve(text);
            }).catch(reject);
        });
    },
    GetRandomGame (playerAndGameId) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.post (this.domain + '/GetRandomGame', playerAndGameId).then((game) => {
                resolve(game);
            }).catch(reject);
        });
    },
    GetPracticeGame (playerAndGameId) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.post (this.domain + '/GetPracticeGame', playerAndGameId).then((game) => {
                resolve(game);
            }).catch(reject);
        });
    },
    UpdateInfo (game) {
        return this.post (this.domain + '/UpdateInfo', game);
    },
    GetFriendGame (gameId) {
        var self = this;
        return new Promise ((resolve, reject) => {
            self.post (self.domain + '/GetFriendGame', {gameId}).then((game) => {
                // --------- Temp
                // game = new Game({
                //     id: "randomString",
                //     progress: NEW_GAME,
                //     text: {
                //         guid: "randomString",
                //         text: "something in the way she moves, attracts me like no other lover.",
                //         type: "song", // Song, book or smthng
                //         name: "something", // Song, book or smthng name
                //         author: "The Beatles" , // Song, book or smthng author
                //         picUrl: "https://i.ytimg.com/vi/lURY5hzr3Cc/hqdefault.jpg" // Song, book or smthng picture
                //     },
                //     players: [],
                //     waitingTime: 10,
                //     textTime: 80,
                //     timePassed: 0,
                //     finishedCount: 0
                // })
                // --- endTemp
                resolve(game);
            }).catch(reject);
        });
    },
    ConnectFriendGame (playerAndGameId) {
        var self = this;
        return new Promise ((resolve, reject) => {
            self.post (self.domain + '/ConnectFriendGame', playerAndGameId).then((game) => {
                // --------- Temp
                // game = new Game({
                //     id: "randomString",
                //     progress: NEW_GAME,
                //     text: {
                //         guid: "randomString",
                //         text: "something in the way she moves, attracts me like no other lover.",
                //         type: "song", // Song, book or smthng
                //         name: "something", // Song, book or smthng name
                //         author: "The Beatles" , // Song, book or smthng author
                //         picUrl: "https://i.ytimg.com/vi/lURY5hzr3Cc/hqdefault.jpg" // Song, book or smthng picture
                //     },
                //     players: [],
                //     waitingTime: 10,
                //     textTime: 80,
                //     timePassed: 0,
                //     finishedCount: 0
                // })
                // --- endTemp
                resolve(game);
            }).catch(reject);
        });
    }
}