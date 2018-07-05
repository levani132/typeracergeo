const Layout = {
    view () {
        return `
            <header class="header">
                <div class="header-left">
                    <div class="header-logo inline-block">
                        <img src="/public/img/logo.png" alt="მწერალი">
                    </div>
                    <ul class="navigation inline-block">
                        <li class="nav-item inline-block"><a href="/race" class="active">რბოლა</a>
                        <!-- </li><li class="nav-item inline-block"><a href="/pitstop">შესვენება</a> -->
                        <!-- </li><li class="nav-item inline-block"><a href="/profile">პროფილი</a> -->
                        <!-- </li><li class="nav-item inline-block"><a href="/history">ისტორია</a> -->
                        <!-- </li><li class="nav-item inline-block"><a href="/competitions">შეჯიბრები</a> -->
                        </li><li class="nav-item inline-block"><a href="/texts">ტექსტები</a>
                        </li><li class="nav-item inline-block"><a href="/about">ჩვენს შესახებ</a>
                        <!-- </li><li class="nav-item inline-block"><a href="/messages">მესიჯები</a> -->
                        <!-- </li><li class="nav-item inline-block"><a href="/friends">მეგობრები</a> -->
                        <!-- </li><li class="nav-item inline-block"><a href="/upgrade">გაუმჯობესება</a> -->
                        </li>
                    </ul>
                </div>
                <div class="header-right">
                    <div class="user-avatar"></div>
                    <div class="header-right-wrapper">
                        <div class="right-top user-section">
                            <div class="header-username inline-block">
                                <span>სტუმარი</span>
                            </div>
                            <div class="header-user-control inline-block">
                                <a class="sign-link" href="#">შესვლა</a>
                                <span class="edit-info"></span>
                            </div>
                        </div>
                        <div class="right-bottom user-section">
                            <a href="#">ოსტატი</a> - 69 <a href="#">ს/წ</a>
                        </div>
                    </div>
                    <div class="user-mini-info">
                        <ul>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">რანკი<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">წერის დონე<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">მოგებული რეისები<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">რეისების რაოდენობა<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">საუკეთესი რეისი<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">ბოლო რეისი<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">ყველა რეისის საშუალო<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">10 რეისის საშუალო<span class="value">14</span></div></li>
                            <li class="user-mini-info-item"><div class="user-mini-info-text">ბიო</div></li>
                        </ul>
                    </div>
                </div>
            </header>
            <router-view></router-view>
        `;
    }
}