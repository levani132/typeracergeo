const Layout = {
    view () {
        return `
            <a href='/playground'>Play</a>
            <a href='/about'>About</a>
            <router-view></router-view>
        `;
    }
}