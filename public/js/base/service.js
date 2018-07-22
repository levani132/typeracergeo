const Service = {
    domain: '',
    request (url, data, method) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() { 
                if (xhr.readyState == 4 && xhr.status == 200)
                    resolve(xhr.responseText[0] == '{' || xhr.responseText[0] == '[' ? JSON.parse(xhr.responseText) : xhr.responseText);
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
            self.post (this.domain + '/GetLoggedInUser').then((loggedInUser) => {
                User.loggedInUser = loggedInUser;
                User.loggedIn = true;
                if(!loggedInUser || typeof loggedInUser == String && !loggedInUser.length)
                    User.resetGuestUser();
                resolve();
            }).catch(reject);
        });
    },
    GetRandomText () {
        return this.post (this.domain + '/GetRandomText');
    },
    GetRandomGame (playerAndGameId) {
        return this.post (this.domain + '/GetRandomGame', playerAndGameId);
    },
    GetPracticeGame (playerAndGameId) {
        return this.post (this.domain + '/GetPracticeGame', playerAndGameId);
    },
    UpdateInfo (game) {
        return this.post (this.domain + '/UpdateInfo', game);
    },
    GetFriendGame (gameId, textId) {
        return this.post (this.domain + '/GetFriendGame', {gameId, textId});
    },
    ConnectFriendGame (playerAndGameId) {
        return this.post (this.domain + '/ConnectFriendGame', playerAndGameId);
    },
    AddText (text) {
        return this.post (this.domain + '/AddText', text);
    },
    GetText (textId) {
        return this.post (this.domain + '/GetText', {textId});
    },
    GetLastTexts () {
        return this.post (this.domain + '/GetLastTexts');
    },
    SearchText (SearchingText) {
        return this.post (this.domain + '/SearchText', {SearchingText});
    },
    Login (username, password) {
        return this.post(this.domain + '/Login', {username, password});
    },
    Register (username, password, repassword) {
        return this.post(this.domain + '/Register', {username, password, repassword});
    },
    Logout () {
        return this.post(this.domain + '/Logout');
    },
    AddStatistics (player) {
        return this.post(this.domain + '/AddStatistics', player);
    }
}