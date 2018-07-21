const AddText = {
    init () {

    },
    onLoad () {

    },
    onExit () {

    },
    saveText (e) {
        e.preventDefault();
        var text = document.querySelector('#add-text-text').value.trim();
        var type = document.querySelector('#add-text-type').value.trim();
        var name = document.querySelector('#add-text-name').value.trim();
        var author = document.querySelector('#add-text-author').value.trim();
        var picUrl = document.querySelector('#add-text-picUrl').value.trim();
        if(!(text.length && type.length && name.length && author.length && picUrl.length)){
            Toastr.callMessage('Fill all inputs');
            return;
        }
        Service.AddText({guid: guid(), text, type, name, author, picUrl}).then(success => {
            if(success){
                Toastr.callMessage('Text succesfully added');
            }else{
                Toastr.callMessage('Something went wrong');
            }
        }).catch(error => {
            Taostr.callMessage('Server error (see console logs)');
            console.error(error);
        });
        document.querySelector('#add-text-text').value = "";
        document.querySelector('#add-text-type').value = "";
        document.querySelector('#add-text-name').value = "";
        document.querySelector('#add-text-author').value = "";
        document.querySelector('#add-text-picUrl').value = "";
        document.querySelector('.text-review').outerHTML = this.textView();
    },
    input () {
        document.querySelector('.text-review').outerHTML = this.textView();
    },
    textView () {
        return `
            <div class="text-review">
                <h1 class="text-review-state">შედეგი:</h1>
                <h1 class="text-review-state">ახლახანს შეყვანილი ნაწყვეტი არის ${document.querySelector('#add-text-type') ? document.querySelector('#add-text-type').value : ""}დან:</h1>
                <img class="text-review-picture" 
                        src="${document.querySelector('#add-text-picUrl') && document.querySelector('#add-text-picUrl').value ? 
                                document.querySelector('#add-text-picUrl').value : 
                                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ic_camera_alt_48px.svg/2000px-Ic_camera_alt_48px.svg.png"}"
                        alt="Picture for text">
                <div class="text-review-left">
                    <a class="text-review-header" href="#">${document.querySelector('#add-text-name') ? document.querySelector('#add-text-name').value : ""}</a>
                    <h2 class="text-review-author">${document.querySelector('#add-text-author') ? document.querySelector('#add-text-author').value : ""}</h2>
                </div>
            </div>
        `;
    },
    view () {
        Router.loadMe(this);
        return `
            <form class="add-text-form">
                <div class="input-wrapper">
                    <textarea autocomplete="falsea" oninput="AddText.input();" name="text" id="add-text-text" required></textarea>
                    <span class="input-placeholder">Text</span>
                </div>
                <div class="input-wrapper">
                    <input autocomplete="falsea" oninput="AddText.input();" name="type" id="add-text-type" type="text" required>
                    <span class="input-placeholder">Text type</span>
                </div>
                <div class="input-wrapper">
                    <input autocomplete="falsea" oninput="AddText.input();" name="name" id="add-text-name" type="text" required>
                    <span class="input-placeholder">Text name</span>
                </div>
                <div class="input-wrapper">
                    <input autocomplete="falsea" oninput="AddText.input();" name="author" id="add-text-author" type="text" required>
                    <span class="input-placeholder">Text author</span>
                </div>
                <div class="input-wrapper">
                    <input autocomplete="falsea" oninput="AddText.input();" name="picUrl" id="add-text-picUrl" type="text" required>
                    <span class="input-placeholder">Text picture url</span>
                </div>
                <input oninput="AddText.input();" type="submit" value="submit" onclick="AddText.saveText(event)">
            </form>
            ${this.textView ()}
        `;
    }
}