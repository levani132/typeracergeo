const Home = {
    view () {
        return `
            <ul class="race-types">
                <li class="race-type main-race">
                    <span class="fa fa-3x fa-users race-type-icon"></span>
                    <div class="race-type-body">
                        <a href="/race/world">
                            <h1 class="race-type-link">დაიწყე რბოლა</h1>
                        </a>
                        <span class="race-type-sub-text">შეეჯიბრი ქართველ მრბოლელებს</span>
                    </div>
                </li>
                <li class="race-type">
                    <span class="fas fa-3x fa-user-friends race-type-icon"></span>
                    <div class="race-type-body">
                        <a href="/race/friend">
                            <h1 class="race-type-link">შეეჯიბრე მეგობარს</h1>
                        </a>
                        <span class="race-type-sub-text">მოიწვიე მეგობრები პირად რბოლაზე</span>
                    </div>
                </li>
                <li class="race-type">
                    <span class="fa fa-3x fa-user race-type-icon"></span>
                    <div class="race-type-body">
                        <a href="/race/friend">
                            <h1 class="race-type-link">ივარჯიშე</h1>
                        </a>
                        <span class="race-type-sub-text">გაიუმჯობესე უნარები მარტომ</span>
                    </div>
                </li>
            </ul>
        `;
    }
}