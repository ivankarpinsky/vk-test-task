window.onload = function () {
    let new_card_buttons = document.getElementsByClassName('add-new-card');
    for (let elem of new_card_buttons) {
        elem.addEventListener("click", adding_new_card);
    }
    let add_new_column = document.getElementsByClassName('add-new-column')[0];
    add_new_column.onclick = function () {
        // достаем нужные элементы, меняем видимость некоторых
        let main_wraper = document.getElementsByClassName('main-wrapper')[0];
        let hidden_col = main_wraper.children[0];
        let new_col = hidden_col.cloneNode(true);
        new_col.style.display = "block";
        new_col.getElementsByClassName('add-new-card')[0].style.display = "none";
        new_col.getElementsByClassName('new-column-wrapper')[0].style.display = "block";
        main_wraper.insertBefore(new_col, main_wraper.children[main_wraper.children.length - 1]);
        let new_column_wrapper = new_col.getElementsByClassName('new-column-wrapper')[0],
            textarea = new_column_wrapper.getElementsByClassName('new-column-text')[0],
            button = new_column_wrapper.getElementsByClassName('green-button')[0],
            cancel = new_column_wrapper.getElementsByClassName('cross-mark')[0];
        let content = null,
            cards_wrapper = new_col.getElementsByClassName('cards-wrapper')[0];
        let hidden_div = cards_wrapper.getElementsByClassName("hiddendiv")[0];
        let txt = textarea;
        // Увеличение высоты textarea с использованием hidden_div
        txt.classList.add('noscroll');
        txt.style.height = "34px";
        txt.onkeyup = function () {
            content = txt.value;
            content = content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            hidden_div.innerHTML = content;
            hidden_div.style.display = "block";
            txt.style.height = hidden_div.offsetHeight + "px";
            hidden_div.style.display = "none";
        };
        new_column_wrapper.style.display = "block";
        // добавление новой колонки
        button.onclick = function () {
            let column_title = document.createElement('div');
            column_title.classList.add('column-title');
            column_title.innerHTML = content;
            dragMaster.addDropTarget(column_title);
            new_col.insertBefore(column_title, new_col.children[0]);
            new_col.getElementsByClassName('add-new-card')[0].style.display = "flex";
            new_col.getElementsByClassName('new-column-wrapper')[0].style.display = "none";
            new_col.getElementsByClassName('add-new-card')[0].onclick = adding_new_card;
            textarea.value = "";
            hidden_div.innerHTML = '';
        };
        cancel.onclick = function () {
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

    //drug'n'drop
    let cards = document.getElementsByClassName('card');
    let column_titles=document.getElementsByClassName('column-title');
    for (let card of cards) {
        dragMaster.addDropTarget(card);
        dragMaster.makeDraggable(card);
    }
    for (let title of column_titles) {
        dragMaster.addDropTarget(title);
    }
};

// добавление новой карточки
function adding_new_card() {
    let new_card_wrapper = this.parentElement.getElementsByClassName('new-card-wrapper')[0],
        textarea = new_card_wrapper.getElementsByClassName('new-card-text')[0],
        button = new_card_wrapper.getElementsByClassName('green-button')[0],
        cancel = new_card_wrapper.getElementsByClassName('cross-mark')[0];
    let content = null,
        cards_wrapper = this.parentElement.getElementsByClassName('cards-wrapper')[0];
    let hidden_div = cards_wrapper.getElementsByClassName("hiddendiv")[0];
    let txt = textarea;
    // Увеличение высоты textarea с использованием hidden_div
    txt.classList.add('noscroll');
    txt.style.height = "34px";
    txt.onkeyup = function () {
        content = txt.value;
        content = content.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        hidden_div.innerHTML = content;
        hidden_div.style.display = "block";
        txt.style.height = hidden_div.offsetHeight + "px";
        hidden_div.style.display = "none";
    };
    new_card_wrapper.style.display = "block";
    this.style.display = "none";
    let add_new_card_button = this;
    button.onclick = function () {
        let card = document.createElement('div');
        card.classList.add("card");
        card.innerHTML = content;
        dragMaster.makeDraggable(card);
        dragMaster.addDropTarget(card);
        cards_wrapper.appendChild(card);
        add_new_card_button.style.display = "flex";
        textarea.value = "";
        new_card_wrapper.style.display = "none";
        hidden_div.innerHTML = '';
    };
    cancel.onclick = function () {
        add_new_card_button.style.display = "flex";
        textarea.value = "";
        new_card_wrapper.style.display = "none";
        hidden_div.innerHTML = '';
    }
}

function fixEvent(e) {
    // получить объект событие для IE
    e = e || window.event;

    // добавить pageX/pageY для IE
    if (e.pageX == null && e.clientX != null) {
        var html = document.documentElement;
        var body = document.body;
        e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
        e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
    }

    // добавить which для IE
    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
    }

    return e
}

var dragMaster = (function () {
    // private методы и свойства
    var dragClone;
    var dragObject;
    var mouseOffset;

    var dropTargets = [];

    /* кеш прямоугольников границ акцепторов */
    var dropTargetRectangles;

    /* текущий акцептор, над которым объект в данный момент */
    var currentDropTarget;

    function cacheDropTargetRectangles() {
        dropTargetRectangles = [];

        for(var i=0; i<dropTargets.length; i++){
            var targ  = dropTargets[i];
            var targPos    = getPosition(targ);
            var targWidth  = parseInt(targ.offsetWidth);
            var targHeight = parseInt(targ.offsetHeight);

            dropTargetRectangles.push({
                xmin: targPos.x,
                xmax: targPos.x + targWidth,
                ymin: targPos.y,
                ymax: targPos.y + targHeight,
                dropTarget: targ
            })
        }

    }


    // получить сдвиг target относительно курсора мыши
    function getMouseOffset(target, e) {
        var docPos = getPosition(target);
        return {x: e.pageX - docPos.x, y: e.pageY - docPos.y}
    }

    function mouseDown(e) {
        e = fixEvent(e);

        if (e.which != 1) return;

        dragObject = this;
        dragClone = this.cloneNode(true);
        mouseOffset = getMouseOffset(this, e);

        with (dragClone.style) {
            position = 'absolute';
            top = e.pageY - mouseOffset.y + 'px';
            left = e.pageX - mouseOffset.x + 'px';
        }

        this.parentNode.appendChild(dragClone);
        dragObject.innerHTML = '';
        dragObject.style.height = dragClone.offsetHeight - 17 + "px";
        dragObject.classList.add('dragged-object');
        dragClone.classList.add('dragged-clone');

        cacheDropTargetRectangles();

        addDocumentEventHandlers();

        return false;
    }

    function getCurrentTarget(e) {
        for(var i=0; i<dropTargetRectangles.length; i++){
            var rect  = dropTargetRectangles[i];

            if(
                (e.pageX > rect.xmin)  &&
                (e.pageX < rect.xmax)  &&
                (e.pageY > rect.ymin)  &&
                (e.pageY < rect.ymax)){
                return rect.dropTarget
            }
        }

        return null
    }


    function mouseMove(e) {
        e = fixEvent(e);

        with (dragClone.style) {
            position = 'absolute';
            top = e.pageY - mouseOffset.y + 'px';
            left = e.pageX - mouseOffset.x + 'px';
        }

        var newTarget = getCurrentTarget(e);

        if (currentDropTarget && currentDropTarget != newTarget) {
            showRollOff(currentDropTarget);
            //новый таргет
        }

        currentDropTarget = newTarget;
        if (newTarget) {
            showRollOn(newTarget);
        }

        return false;
    }

    function mouseUp(e) {
        e = fixEvent(e);

        if (currentDropTarget) {
            // showRollOff(currentDropTarget)
        }
        dragObject.innerHTML=dragClone.innerHTML;
        dragObject.classList.remove('dragged-object');
        dragClone.parentElement.removeChild(dragClone);
        // dragClone = null;
        removeDocumentEventHandlers();
    }

    function showRollOn(elem) {
        insertAfter(dragObject,elem);
    }

    function showRollOff(elem) {
        elem.classList.remove('uponMe');
    }


    function removeDocumentEventHandlers() {
        document.onmousemove = null;
        document.onmouseup = null;
        document.ondragstart = null;
        document.body.onselectstart = null;
    }

    function addDocumentEventHandlers() {
        document.onmousemove = mouseMove;
        document.onmouseup = mouseUp;

        document.ondragstart = function () {
            return false
        };
        document.body.onselectstart = function () {
            return false
        };
    }

    // public методы и свойства
    return {
        makeDraggable: function (element) {
            // сделать элемент переносимым
            element.onmousedown = mouseDown;
        },
        addDropTarget: function (dropTarget) {
            dropTargets.push(dropTarget);
        }
    }

}());

function getPosition(e) {
    var left = 0;
    var top = 0;

    while (e.offsetParent) {
        left += e.offsetLeft;
        top += e.offsetTop;
        e = e.offsetParent;
    }

    left += e.offsetLeft;
    top += e.offsetTop;

    return {x: left, y: top}
}

function insertAfter(elem, refElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(elem, next);
    } else {
        return parent.appendChild(elem);
    }
}

