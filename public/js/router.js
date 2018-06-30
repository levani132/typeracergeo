const Router = {
    routes: {
        '' : 'default',
        'playground' : 'default'
    },
    openModule(module){
        if(!Module.checkModule(module)){
            console.error("No module with name", module);
            return;
        }
        Module.afterLoad(() => {
            if (!Module.loadModule(module)) {
                document.querySelector('router-view').innerHTML = Module.getModule(module).view();
            }
        });
    },
    routeResolver(){
        var module = window.location.pathname.split('/')[1] || '';
        if (!Module.checkModule(module)){
            module = Router.routes[module];
        }
        this.openModule(module);
    }
}

Router.routeResolver();

document.body.onclick = e => {
    e = e || event;
    var from = findParent('a', e.target || e.srcElement);
    if (from){
        if(from.href.substr(0, origin.length) === origin){
            e.preventDefault();
            window.history.pushState({}, "", from.href);
            Router.routeResolver();
        }
    }
}
  
function findParent(tagname,el) {
    while (el){
        if ((el.nodeName || el.tagName).toLowerCase()===tagname.toLowerCase()){
            return el;
        }
        el = el.parentNode;
    }
    return null;
}

window.onpopstate = e => {
    Router.routeResolver();
};