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
                text =  `This is some English text to test my writing skills. Let's make it bigger to test my skills better.`;
                // ---
                resolve(text);
            }).catch(reject);
        })
    }
}