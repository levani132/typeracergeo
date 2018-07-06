const Service = {
    domain: '',
    request (url, data, method) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() { 
                if (xhr.readyState == 4 && xhr.status == 200)
                    resolve(xhr.responseText);
                else if (xhr.readyState == 4 && xhr.status != 200)
                    reject(xhr.response);
            }
            xhr.open(method, url, true); // true for asynchronous 
            xhr.send(data);
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
                // Temporary
                text = {
                    id: 0,
                    text: `This is some English text to test my writing skills. Let's make it bigger to test my skills better.`,
                    type: "ტექსტი", // Song, book or smthng
                    name: "მაგალითი", // Song, book or smthng name
                    author: "ლევან ბეროშვილი", // Song, book or smthng author
                    picUrl: "https://picsum.photos/200/300" // Song, book or smthng picture
                };
                // ---
                resolve(text);
            }).catch(reject);
        });
    },
    GetRandomGame () {
        var self = this;
        return new Promise((resolve, reject) => {
            self.get (this.domain + '/GetRandomGame').then((game) => {
                // Temporary
                game = new Game();
                // ---
                resolve(game);
            }).catch(reject);
        });
    }
}