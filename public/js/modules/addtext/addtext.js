const AddText = {
    init () {

    },
    onLoad () {

    },
    onExit () {

    },
    saveText (e) {
        e.preventDefault();
        var text = document.querySelector('#add-text-text').value;
        var type = document.querySelector('#add-text-type').value;
        var name = document.querySelector('#add-text-name').value;
        var author = document.querySelector('#add-text-author').value;
        var picUrl = document.querySelector('#add-text-picUrl').value;
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
    },
    view () {
        Router.loadMe(this);
        return `
            <form class="add-text-form">
                <textarea name="text" id="add-text-text" placeholder="Write a text..."></textarea>
                <input name="type" id="add-text-type" type="text" placeholder="Text type...">
                <input name="name" id="add-text-name" type="text" placeholder="Text name...">
                <input name="author" id="add-text-author" type="text" placeholder="Text author...">
                <input name="picUrl" id="add-text-picUrl" type="text" placeholder="Text picture...">
                <input type="submit" value="submit" onclick="AddText.saveText(event)">
            </form>
        `;
    }
}