const Service = {
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
    }
}