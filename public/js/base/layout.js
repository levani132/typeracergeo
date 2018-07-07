const Layout = {
    disabled: false,
    disable () {
        this.disabled = true;
        document.querySelector('main').classList.remove('main');
    },
    enable () {
        this.disabled = false;
        document.querySelector('main').classList.add('main');
    },
    view () {
        return `
            ${Header.view()}
            <main class="${this.disbaled ? '' : 'main'}">
                <router-view></router-view>
            </main>
        `;
    }
}