const Texts = {
    openedText: null,
    texts: [],
    searchingText: "",
    onLoad () {
        if(Router.route() == 'text'){
            Service.GetText(Router.innerRoute()).then(this.getText);
        }else{
            Service.GetLastTexts().then(this.getTexts).catch(this.noTexts);
        }
        this.refresh();
    },
    onExit () {
        Texts.openedText = null;
    },
    getText(text) {
        Texts.openedText = text;
        Texts.refresh();
    },
    getTexts(texts) {
        Texts.texts = texts;
        Texts.refresh();
    },
    noTexts (error) {
        Texts.texts = [];
        Texts.refresh();
    },
    search (e) {
        Texts.searchingText = e.target.value;
        var refreshInput = () => {
            document.querySelector('.texts-list').innerHTML = 
                                        Texts.texts.length ? 
                                            Texts.texts.map(text => Texts.miniTextView(text)).join('') : 
                                            'ტექსტები არ მოიძებნა';
        }
        var getResp = res => {
            Texts.texts = res;
            refreshInput();
        }
        var getErr = err => {
            Texts.texts = [];
            refreshInput();
        }
        if(Texts.searchingText.length)
            Service.SearchText(Texts.searchingText).then(getResp).catch(getErr);
        else
            Service.GetLastTexts().then(getResp).catch(getErr);
    },
    refresh () {
        if(Router.route() == 'text'){
            document.querySelector('.text-view').outerHTML = this.textView();
        }else{
            document.querySelector('.texts-section').outerHTML = this.view();
        }
    },
    googleSearch(query){
        return `http://www.google.com/search?q=${query.split(' ').join('+')}`;
    },
    miniTextView (text) {
        return `
            <li class="texts-item">
                <a href="/text/${text.guid}" class="texts-item-link">${text.name}</a> ${text.author}
            </li>
        `;
    },
    textView() {
        if(!this.openedText){
            Router.loadMe(this);
            return `
                <div class="text-view"></div>
            `;
        }
        return `
            <div class="text-view">
                <div class="text-view-header-wrapper">
                    <a class="text-view-header" href="${this.googleSearch(this.openedText.name)}" target="_blank">${this.openedText.name}</a>
                    <h2 class="text-view-author">${this.openedText.author}</h2>
                </div>
                <img class="text-view-picture" src="${this.openedText.picUrl}">
                <div class="text-view-left">
                ${this.openedText.player ? `
                    <h2 class="text-view-best-header">ამ ტექსტის საუკეთესო შედეგი:</h2>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">სიჩქარე:</span>
                        <span class="text-review-stat-value">${this.openedText.player.speed} ს/წთ</span>
                    </div>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">დრო:</span>
                        <span class="text-review-stat-value">${this.openedText.player.timeNeeded}</span>
                    </div>
                    <div class="text-review-stat">
                        <span class="text-review-stat-name">აკურატულობა:</span>
                        <span class="text-review-stat-value">${this.openedText.player.accuracy}%</span>
                    </div>
                ` : `
                    <h2 class="text-view-best-header">ეს ტექსტი ჯერ არცერთ მომხმარებელს არ შეუყვანია.</h2>
                `}
                    <a href="/race/text/${this.openedText.guid}" class="text-view-race">ამ ტექსტით რბოლა</a>
                </div>
                <div class="race-text text-view-text">${this.openedText.text}</div>
            </div>
        `;
    },
    view() {
        Router.loadMe(this);
        return `
            <div class="texts-section">
                <h1 class="texts-header">${this.searchingText.length ? `ტექსტები რომლებიც შეიცავს: "${this.searchingText}"` : `ბოლოს გამოყენებული ტექსტები` }</h1>
                <input class="texts-search-input" oninput="Texts.search(event)" placeholder="შეიყვანეთ ნაწყვეტი საძებნი ტექსტიდან..." value="${this.searchingText}">
                <ol class="texts-list">
                    ${this.texts.length ? this.texts.map(text => this.miniTextView(text)).join('') : 'ტექსტები არ მოიძებნა'}
                </ol>
                <a href="/addtext">ტექსტის დამატება</a>
            </div>
        `;
    }
}