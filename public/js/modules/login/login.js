const Login = {
    registering: false, 
    init () {
        registering = (Router.route()  == 'register') ? true : false;
    },
    view () {
        return `
            <div class="login-left">
                <div class="login-logo">
                    <img src="/public/img/logoWithLabel.png">
                </div>
            </div>
            <div class="login-background-right">
                <div class=login-input-wrapper>
                    <div class="login-input-header">შესვლა</div>
                    <input class="login-input" placeholder="სახელი"></input>
                    <input class="login-input" placeholder="პაროლი" type="password"></input>
                    <input class="login-input ${this.registering ? '' : 'hidden'}" placeholder="გაიმეორეთ პაროლი" type="password"></input>
                    <div class="login-input login-button">შესვლა</div>
                    <div class="login-register-button-wrapper ${this.registering ? 'hidden' : ''} ">
                        <div class="login-register-button">რეგისტრაცია</div>
                    </div>
                </div>
            </div>
        `;
    }

}