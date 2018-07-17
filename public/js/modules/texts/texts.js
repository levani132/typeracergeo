const Texts = {
    openedText: {
        guid: guid(),
        text: `ვიცი, ბოლოდ`,
        type: "ტექსტი", // Song, book or smthng
        name: "ვეფხისტყაოსანი", // Song, book or smthng name
        author: "შოთა რუსთაველი", // Song, book or smthng author
        picUrl: "https://loremflickr.com/200/300", // Song, book or smthng picture
        player: {
            speed: "120",
            timeNeeded: "1:07",
            accuracy: "97.9"
        }
    },
    texts: [],
    searchingText: "",
    onLoad () {
        var self = this;
        if(Router.route() == 'text'){
            Service.GetText({textId: Router.innerRoute()}).then(self.getText);
        }else{
            Service.GetLastTexts().then(self.getTexts);
        }
    },
    onExit () {

    },
    getText(text) {
        Texts.openedText = text;
        Texts.refresh();
    },
    getTexts(texts) {
        Texts.texts = text;
        Texts.refresh();
    },
    search (e) {
        this.searchingText = e.target.value;
        var self = this;
        Service.SearchText({SearchingText: this.SearchingText}).then(self.getTexts);
        this.refresh();
        document.querySelector('.texts-search-input').selectionStart = e.target.value.length;
        document.querySelector('.texts-search-input').selectionEnd = e.target.value.length;
        document.querySelector('.texts-search-input').focus();
    },
    refresh () {
        if(Router.route() == 'text'){
            document.querySelector('.texts-view').outerHTML = this.textView();
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
                <a href="#" class="texts-item-link" onclick="Texts.chooseText(text.id)">${text.name}</a> ${text.author}
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
                    <a href="#" class="text-view-race">ამ ტექსტით რბოლა</a>
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
                    <li class="texts-item">
                        <a href="#" class="texts-item-link">მგზავრის წერილები</a> ილია ჭავჭავაძე
                    </li>
                    <li class="texts-item">
                        <a href="#" class="texts-item-link">ვეფხისტყაოსანი</a> შოთა რუსთაველი
                    </li>
                    <li class="texts-item">
                        <a href="#" class="texts-item-link">მერანი</a> ნიკოლოზ ბართაშვილი
                    </li>
                    <li class="texts-item">
                        <a href="#" class="texts-item-link">გამზრდელი</a> აკაკი წერეთელი
                    </li>
                    <li class="texts-item">
                        <a href="#" class="texts-item-link">კაცია, ადამიანი?!</a> ილია ჭავჭავაძე
                    </li>
                    <li class="texts-item">
                        <a href="#" class="texts-item-link">ჯაყოს ხიზნები</a> მიხეილ ჯავახიშვილი
                    </li>
                </ol>
            </div>
        `;
    }
}