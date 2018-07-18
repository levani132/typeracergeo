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
        return this.post (self.domain + '/GetRandomText');
    },
    GetRandomGame (playerAndGameId) {
        return this.post (self.domain + '/GetRandomGame', playerAndGameId);
    },
    GetPracticeGame (playerAndGameId) {
        return this.post (self.domain + '/GetPracticeGame', playerAndGameId);
    },
    UpdateInfo (game) {
        return this.post (this.domain + '/UpdateInfo', game);
    },
    GetFriendGame (gameId) {
        return this.post (self.domain + '/GetFriendGame', {gameId});
    },
    ConnectFriendGame (playerAndGameId) {
        return this.post (self.domain + '/ConnectFriendGame', playerAndGameId);
    },
    AddText (text) {
        return this.post (self.domain + '/AddText', text);
    },
    GetText (textId) {
        return this.post (self.domain + '/GetText', {textId});
    },
    GetLastTexts () {
        return this.post (self.domain + '/GetLastTexts');
    },
    SearchText (SearchingText) {
        return this.post (self.domain + '/SearchText', {SearchingText});
    }
}