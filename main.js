window.onload = function () {
    let new_card_buttons = document.getElementsByClassName('add-new-card');
    for (let elem of new_card_buttons) {
        elem.addEventListener("click", adding_new_card);
    }
    let add_new_column=document.getElementsByClassName('add-new-column')[0];
    add_new_column.onclick=function () {
        let main_wraper=document.getElementsByClassName('main-wrapper')[0];
        let hidden_col=main_wraper.children[0];
        let new_col=hidden_col.cloneNode(true);
        new_col.style.display="block";
        new_col.getElementsByClassName('add-new-card')[0].style.display="none";
        new_col.getElementsByClassName('new-column-wrapper')[0].style.display="block";
        main_wraper.insertBefore(new_col,main_wraper.children[main_wraper.children.length-1]);
        let new_column_wrapper=new_col.getElementsByClassName('new-column-wrapper')[0],
            textarea=new_column_wrapper.getElementsByClassName('new-column-text')[0],
            button=new_column_wrapper.getElementsByClassName('green-button')[0],
            cancel=new_column_wrapper.getElementsByClassName('cross-mark')[0];
        let content = null,
            cards_wrapper=new_col.getElementsByClassName('cards-wrapper')[0];
        let hidden_div=cards_wrapper.getElementsByClassName("hiddendiv")[0];
        let txt = textarea;
        // Увеличение высоты textarea с использованием hidden_div
        txt.classList.add('noscroll');
        txt.style.height = "34px";
        txt.onkeyup=function () {
            content = txt.value;
            content = content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            hidden_div.innerHTML = content;
            hidden_div.style.display="block";
            txt.style.height = hidden_div.offsetHeight+"px";
            hidden_div.style.display="none";
        };
        new_column_wrapper.style.display="block";
        button.onclick=function () {
            let column_title=document.createElement('div');
            column_title.classList.add('column-title');
            column_title.innerHTML=content;
            new_col.insertBefore(column_title,new_col.children[0]);
            new_col.getElementsByClassName('add-new-card')[0].style.display="flex";
            new_col.getElementsByClassName('new-column-wrapper')[0].style.display="none";
            new_col.getElementsByClassName('add-new-card')[0].onclick=adding_new_card;
            textarea.value="";
            hidden_div.innerHTML='';
        };
        cancel.onclick=function() {
            new_col.parentElement.removeChild(new_col);
        }
    };


    // document.onkeydown = function(e) {
    //     e = e || window.event;
    //     if (e.ctrlKey && (e.keyCode == 83)) {
    //         e.preventDefault();
    //         let buttons = document.getElementsByClassName('green-button');
    //         for (let elem of buttons) {
    //             if (elem.style.display!="none") {
    //                 elem.click();
    //             }
    //         }
    //     }
    // }

};

function adding_new_card () {
    let new_card_wrapper=this.parentElement.getElementsByClassName('new-card-wrapper')[0],
        textarea=new_card_wrapper.getElementsByClassName('new-card-text')[0],
        button=new_card_wrapper.getElementsByClassName('green-button')[0],
        cancel=new_card_wrapper.getElementsByClassName('cross-mark')[0];
    let content = null,
        cards_wrapper=this.parentElement.getElementsByClassName('cards-wrapper')[0];
    let hidden_div=cards_wrapper.getElementsByClassName("hiddendiv")[0];
    let txt = textarea;
    // Увеличение высоты textarea с использованием hidden_div
    txt.classList.add('noscroll');
    txt.style.height = "34px";
    txt.onkeyup=function () {
        content = txt.value;
        content = content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        hidden_div.innerHTML = content;
        hidden_div.style.display="block";
        txt.style.height = hidden_div.offsetHeight+"px";
        hidden_div.style.display="none";
    };
    new_card_wrapper.style.display="block";
    this.style.display="none";
    let add_new_card_button=this;
    button.onclick=function () {
        let card=document.createElement('div');
        card.classList.add("card");
        card.innerHTML=content;
        cards_wrapper.appendChild(card);
        add_new_card_button.style.display="flex";
        textarea.value="";
        new_card_wrapper.style.display="none";
        hidden_div.innerHTML='';
    };
    cancel.onclick=function() {
        add_new_card_button.style.display="flex";
        textarea.value="";
        new_card_wrapper.style.display="none";
        hidden_div.innerHTML='';
    }
}
