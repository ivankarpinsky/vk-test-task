//ctrl+enter to save card or column

document.onkeydown = function (e) {
    e = e || window.event;
    if ((event.ctrlKey) && (event.keyCode === 13)) {
        e.preventDefault();
        let buttons = document.getElementsByClassName('green-button');
        for (let elem of buttons) {
            if (elem.onclick) {
                elem.click();
            }
        }
    }
};

window.onload = function () {
    let new_card_buttons = document.getElementsByClassName('add-new-card');
    let new_column_button = document.getElementsByClassName('add-new-column')[0];
    let cards = document.getElementsByClassName('card');
    let column_titles = document.getElementsByClassName('column-title');


    for (let elem of new_card_buttons) {
        elem.addEventListener("click", addNewCard);
    }

    new_column_button.onclick = addNewColumn;

    //drug'n'drop
    for (let card of cards) {
        dragMaster.addDropTarget(card);
        dragMaster.makeDraggable(card);
    }

    for (let title of column_titles) {
        dragMaster.addDropTarget(title);
    }
};

function addNewCard() {
    let adding_card_wrapper = this.parentElement.getElementsByClassName('adding-card-wrapper')[0],
        button = adding_card_wrapper.getElementsByClassName('green-button')[0],
        cancel = adding_card_wrapper.getElementsByClassName('cross-mark')[0],
        cards_wrapper = this.parentElement.getElementsByClassName('cards-wrapper')[0],
        textarea = adding_card_wrapper.getElementsByClassName('new-card-text')[0],
        hidden_div = cards_wrapper.getElementsByClassName("hiddendiv")[0],
        content = null,
        add_new_card_button = this;

    textareaAutoHeight();

    adding_card_wrapper.style.display = "block";
    this.style.display = "none";

    button.onclick = saveNewCard;

    cancel.onclick = cancelNewCard;

    function textareaAutoHeight() {
        textarea.classList.add('noscroll');
        textarea.style.height = "34px";

        textarea.onkeyup = function () {
            content = textarea.value;
            content = content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            hidden_div.innerHTML = content;
            hidden_div.style.display = "block";
            textarea.style.height = hidden_div.offsetHeight + "px";
            hidden_div.style.display = "none";
        };
    }

    function saveNewCard() {
        let card = document.createElement('div');

        card.classList.add("card");
        card.innerHTML = content;

        dragMaster.makeDraggable(card);
        dragMaster.addDropTarget(card);

        cards_wrapper.appendChild(card);

        add_new_card_button.style.display = "flex";
        adding_card_wrapper.style.display = "none";
        textarea.value = "";
        hidden_div.innerHTML = '';

        this.onclick = null;
    }

    function cancelNewCard() {
        add_new_card_button.style.display = "flex";
        adding_card_wrapper.style.display = "none";
        hidden_div.innerHTML = '';
        textarea.value = "";

        this.onclick = null;
    }
}

function addNewColumn() {
    let main_wraper = document.getElementsByClassName('main-wrapper')[0],
        hidden_col = main_wraper.children[0],
        new_col = hidden_col.cloneNode(true),
        adding_column_wrapper = new_col.getElementsByClassName('adding-column-wrapper')[0],
        textarea = adding_column_wrapper.getElementsByClassName('new-column-text')[0],
        button = adding_column_wrapper.getElementsByClassName('green-button')[0],
        cancel = adding_column_wrapper.getElementsByClassName('cross-mark')[0],
        cards_wrapper = new_col.getElementsByClassName('cards-wrapper')[0],
        hidden_div = cards_wrapper.getElementsByClassName("hiddendiv")[0],
        content = null;
        new_col.style.display = "block";
        
    new_col.getElementsByClassName('add-new-card')[0].style.display = "none";
    new_col.getElementsByClassName('adding-column-wrapper')[0].style.display = "block";
    
    main_wraper.insertBefore(new_col, main_wraper.children[main_wraper.children.length - 1]);

    textareaAutoHeight();

    button.onclick = saveNewColumn;

    cancel.onclick = cancelNewColumn;

    function textareaAutoHeight() {
        textarea.classList.add('noscroll');
        textarea.style.height = "34px";

        textarea.onkeyup = function () {
            content = textarea.value;
            content = content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            hidden_div.innerHTML = content;
            hidden_div.style.display = "block";
            textarea.style.height = hidden_div.offsetHeight + "px";
            hidden_div.style.display = "none";
        };
    }

    function saveNewColumn() {
        let column_title = document.createElement('div');

        column_title.classList.add('column-title');
        column_title.innerHTML = content;

        dragMaster.addDropTarget(column_title);

        new_col.insertBefore(column_title, new_col.children[0]);
        new_col.getElementsByClassName('add-new-card')[0].style.display = "flex";
        new_col.getElementsByClassName('adding-column-wrapper')[0].style.display = "none";
        new_col.getElementsByClassName('add-new-card')[0].onclick = addNewCard;

        textarea.value = "";
        hidden_div.innerHTML = '';

        this.onclick = null;
    }

    function cancelNewColumn() {
        new_col.parentElement.removeChild(new_col);
    }
}


