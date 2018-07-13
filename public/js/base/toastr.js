var Toastr = {
    callMessage(message){
        this.message = message;
        var elem = document.querySelector('.toastr');
        elem = document.createElement('div');
        document.querySelector('app').appendChild(elem);
        elem.outerHTML = this.view();
        setTimeout(() => document.querySelector('.toastr').classList.remove('done'), 1);
        this.closeAfter(2);
    },
    closeAfter(seconds){
        setTimeout(() => {
            document.querySelector('.toastr').classList.add('done');
            setTimeout(() => {
                document.querySelector('.toastr').remove();
            }, 1000);
        }, 1000 * seconds);
    },
    view () {
        return `
            <div class="toastr done">${this.message}</toastr>
        `;
    }
}