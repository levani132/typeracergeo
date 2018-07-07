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
    GetRandomGame (player) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.post (this.domain + '/GetRandomGame', player).then((game) => {
                resolve(game);
            }).catch(reject);
        });
    },
    UpdateInfo (game) {
        return this.post (this.domain + '/UpdateInfo', game);
    }
}