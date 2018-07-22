const Login = {
    registering: false, 
    init () {
        Login.registering = Router.route()  == 'register';
        if(Router.route() == 'logout'){
            Service.Logout().then(User.resetGuestUser);
        }
    },
    onLoad () {
        Header.disable();
        Layout.disable();
        document.querySelector('html').style.overflow = 'hidden';
    },
    onExit () {
        Header.enable();
        Layout.enable();
        document.querySelector('html').removeAttribute('style');
    },
    login (e) {
        e.preventDefault();
        var username = document.querySelector('#username').value;
        var password = document.querySelector('#password').value;
        if(!(username.length && password.length)){
            Toastr.callMessage('Fill all inputs');
            return;
        }
        Service.Login(username, password).then(() => {
            document.querySelector('#username').value = "";
            document.querySelector('#password').value = "";
            User.loggedIn = true;
            Router.redirectTo(`${window.location.origin}/`);
        }).catch(error => {
            Toastr.callMessage(error);
        })
    },
    register (e) {
        e.preventDefault();
        var username = document.querySelector('#username').value;
        var password = document.querySelector('#password').value;
        var repassword = document.querySelector('#repassword').value;
        if(!(username.length && password.length && repassword.length)){
            Toastr.callMessage('Fill all inputs');
            return;
        }
        if(password != repassword){
            Toastr.callMessage("Passwords don't match");
        }
        Service.Register(username, password, repassword).then(() => {
            document.querySelector('#username').value = "";
            document.querySelector('#password').value = "";
            document.querySelector('#repassword').value = "";
            Router.redirectTo(`${window.location.origin}/`);
        }).catch(error => {
            Toastr.callMessage(error);
        })
    },
    view () {
        Router.loadMe(this);
        return `
            <div class="login-left">
                <div class="login-logo">
                    <a href="/">
                        <img src="/public/img/logoWithLabel.png">
                    </a>
                </div>
            </div>
            <div class="login-background-right">
                <div class="login-input-wrapper"
                        style="${!this.registering ? 
                            'top:calc(50% - 28px);left:calc(35% - 36px);' : 
                            ''}">
                    <div class="login-input-header">
                        ${!this.registering ? 'შესვლა' : 'რეგისტრაცია'}
                    </div>
                    <form action="" method="POST" onsubmit="${this.registering ? 'Login.register(event)' : 'Login.login(event)'}">
                        <input name="username" id="username" class="login-input" placeholder="სახელი"></input>
                        <input name="password" id="password" class="login-input" placeholder="პაროლი" type="password"></input>
                        <input name="repassword" id="repassword" class="login-input ${this.registering ? '' : 'hidden'}" placeholder="გაიმეორეთ პაროლი" type="password"></input>
                        <input type="submit" hidden>
                    </form>
                    <div class="login-input login-button"
                            onclick="${this.registering ? 'Login.register(event)' : 'Login.login(event)'}">
                        ${!this.registering ? 'შესვლა' : 'რეგისტრაცია'}
                    </div>
                    <div class="login-register-button-wrapper">
                        <a href="${this.registering ? '/login' : '/register'}" class="login-register-button">
                            ${this.registering ? 'შესვლა' : 'რეგისტრაცია'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

}