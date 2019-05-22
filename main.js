window.onload = function () {
    let new_card_buttons = document.getElementsByClassName('add-new-card');
    for (let elem of new_card_buttons) {
        elem.addEventListener("click", function () {
            let new_card_wrapper=this.parentElement.getElementsByClassName('new-card-wrapper')[0],
                textarea=new_card_wrapper.getElementsByClassName('new-card-text')[0],
                button=new_card_wrapper.getElementsByClassName('green-button')[0],
                cancel=new_card_wrapper.getElementsByClassName('cross-mark')[0];
            let content = null,
                cards_wrapper=this.parentElement.getElementsByClassName('cards-wrapper')[0];
            let hiddenDiv=cards_wrapper.getElementsByClassName("hiddendiv")[0];
            let txt = textarea;
            // Увеличение высоты textarea с использованием hiddendiv
            txt.classList.add('noscroll');
            txt.style.height = "34px";
            txt.onkeyup=function () {
                content = txt.value;
                content = content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
                hiddenDiv.innerHTML = content;
                hiddenDiv.style.display="block";
                txt.style.height = hiddenDiv.offsetHeight+"px";
                hiddenDiv.style.display="none";
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
                hiddenDiv.innerHTML='';
            };
            cancel.onclick=function() {
                add_new_card_button.style.display="flex";
                textarea.value="";
                new_card_wrapper.style.display="none";
                hiddenDiv.innerHTML='';
            }
        });
    }

};
