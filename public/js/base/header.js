const Header = {
    name: 'header',
    refresh () {
        Service.GetLoggedInUser().then(() => {
            document.querySelector('header').outerHTML = this.view();
        });
    },
    view () {
        return `
            <header class="header">
                <div class="header-left">
                    <div class="header-logo inline-block">
                        <img src="/public/img/logo.png" alt="მწერალი">
                    </div>
                    <ul class="navigation inline-block">
                        <li class="nav-item inline-block"><a href="/race" ${Router.route() == 'race' ? `class="active"` : ``}>რბოლა</a>
                        </li><li class="nav-item inline-block"><a href="/texts" ${Router.route() == 'texts' ? `class="active"` : ``}>ტექსტები</a>
                        </li><li class="nav-item inline-block"><a href="/about" ${Router.route() == 'about' ? `class="active"` : ``}>ჩვენს შესახებ</a>
                        </li>
                    </ul>
                </div>
                <div class="header-right">
                    <div class="user-avatar"></div>
                    <div class="header-right-wrapper">
                        <div class="right-top user-section">
                            <div class="header-username inline-block">
                                <span>${User.loggedInUser.name}</span>
                            </div>
                            <div class="header-user-control inline-block">
                                <a class="sign-link" href="#">${User.loggedIn ? 'გამოსვლა' : 'შესვლა'}</a>
                            </div>
                        </div>
                        <div class="right-bottom user-section">
                            <a href="#">${User.loggedInUser.rank}</a> - ${User.loggedInUser.tenAvg} <a href="#">ს/წ</a>
                        </div>
                    </div>
                    <div class="user-mini-info">
                        <ul>
                            <li class="user-mini-info-item">
                                <div class="user-mini-info-text">
                                    რანკი<span class="value">${User.loggedInUser.rank}</span>
                                </div>
                            </li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">წერის დონე<span class="value">${User.loggedInUser.level}%</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">მოგებული რეისები<span class="value">${User.loggedInUser.wonRaces}</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">რეისების რაოდენობა<span class="value">${User.loggedInUser.nRaces}</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">საუკეთესი რეისი<span class="value">${User.loggedInUser.bestRace}</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">ბოლო რეისი<span class="value">${User.loggedInUser.lastTenRaces.length ? User.loggedInUser.lastTenRaces[User.loggedInUser.lastTenRaces.length - 1] : 0}</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">ყველა რეისის საშუალო<span class="value">${User.loggedInUser.allTimeAvg}</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">10 რეისის საშუალო<span class="value">${User.loggedInUser.tenAvg}</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">ბიო</div></li>
                        </ul>
                    </div>
                </div>
            </header>
        `;
    }
}