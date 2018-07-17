Module.module({
    name: 'texts',
    scripts: [
        '/texts.js',
    ],
    onInit () {
        Router.openModule(this.name);
    },
    view () {
        if(Router.route() == 'text' && Router.innerRoute() != ''){
            return Texts.textView();
        }
        return Texts.view();
    }
});