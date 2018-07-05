const Layout = {
    view () {
        return `
            ${Header.view()}
            <main class="main">
                <router-view></router-view>
            </main>
        `;
    }
}