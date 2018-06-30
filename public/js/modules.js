const modulesPath = '/public/js/modules/', modulesStart = '/start.js';
const Module = {
    modules: {
        "default": false,
        "about": false,
    },
    loadedModules: {},
    loaded: false,
    afterLoadCallBacks: [],
    loadModule (module) {
        if(Module.modules[module]){
            return false;
        }else{
            Module.loadScripts([`${modulesPath}${module}${modulesStart}`]);
            return true;
        }
    },
    loadScripts(scripts, module){
        return new Promise(function(resolve, reject){
            var selector = module ? `.${module}-module` : `.modules`;
            var moduleElem = document.querySelector(selector);
            scripts = scripts || new Array();
            var loadedScripts = 0;
            function resolveLoad(){
                scriptElem.onreadystatechange = null;
                loadedScripts++;
                if (loadedScripts == scripts.length) {
                    resolve();
                }
            }
            for (i in scripts) {
                var script = scripts[i];
                var scriptElem = document.createElement("script");
                scriptElem.setAttribute('module', module);
                scriptElem.type = "text/javascript";
                if (scriptElem.readyState){  // IE
                    scriptElem.onreadystatechange = () => {
                        if (scriptElem.readyState == "loaded" || scriptElem.readyState == "complete"){
                            resolveLoad();
                        }
                    };
                } else {  // Others
                    scriptElem.onload = () => {
                        resolveLoad();
                    };
                }
                scriptElem.src = script;
                moduleElem.appendChild(scriptElem);
            }
        });
    },
    module (module) {
        Module.loadScripts(module.scripts.map(script => `${modulesPath}${module.name}${script}`)).then(() => {
            Module.loadedModules[module.name] = module;
            Module.modules[module.name] = true;
            module.onInit();
        });
        
    },
    getModule (module) {
        return Module.loadedModules[module];
    },
    checkModule (module) {
        return Object.keys(Module.modules).indexOf(module) != -1;
    },
    afterLoad (callBack) {
        if(!Module.loaded){
            Module.afterLoadCallBacks.push(callBack);
        }else{
            callBack();
        }
    },
    afterLoadCallBack () {
        for (var i in Module.afterLoadCallBacks){
            Module.afterLoadCallBacks[i]();
        }
        Module.afterLoadCallBacks = [];
    }
}

var toLoad = Object.keys(Module.modules).filter(module => Module.modules[module]);
var toLoadLength = toLoad.length;
var loaded = 0;

toLoad.map(module => `${modulesPath}${module}${modulesStart}`)
    .forEach(module => {
        Module.loadScripts([module]).then(() => {
            if(loaded == toLoadLength){
                Module.loaded = true;
                Module.afterLoadCallBack();
            }
        });
    });

if(!toLoadLength){
    Module.loaded = true;
    Module.afterLoadCallBack();
}