let dragMaster = (function () {
    // private методы и свойства
    let dragClone;
    let dragObject;
    let mouseOffset;
    let dropTargets = [];
    let dropTargetRectangles; /* кеш прямоугольников границ акцепторов */
    let currentDropTarget;    /* текущий акцептор, над которым объект в данный момент */

    function cacheDropTargetRectangles() {
        dropTargetRectangles = [];

        for (let i = 0; i < dropTargets.length; i++) {
            let targ = dropTargets[i];
            let targPos = getPosition(targ);
            let targWidth = parseInt(targ.offsetWidth);
            let targHeight = parseInt(targ.offsetHeight);

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
        let docPos = getPosition(target);
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
        for (let i = 0; i < dropTargetRectangles.length; i++) {
            let rect = dropTargetRectangles[i];

            if ((e.pageX > rect.xmin) &&
                (e.pageX < rect.xmax) &&
                (e.pageY > rect.ymin) &&
                (e.pageY < rect.ymax)) {
                return rect.dropTarget
            }
        }

        return null
    }


    function mouseMove(e) {
        let newTarget = null;

        e = fixEvent(e);

        with (dragClone.style) {
            position = 'absolute';
            top = e.pageY - mouseOffset.y + 'px';
            left = e.pageX - mouseOffset.x + 'px';
        }

        newTarget = getCurrentTarget(e);

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

        dragObject.innerHTML = dragClone.innerHTML;
        dragObject.classList.remove('dragged-object');
        dragClone.parentElement.removeChild(dragClone);

        removeDocumentEventHandlers();
    }

    function showRollOn(elem) {
        insertAfter(dragObject, elem);
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
            element.onmousedown = mouseDown;
        },
        addDropTarget: function (dropTarget) {
            dropTargets.push(dropTarget);
        }
    }

}());

function getPosition(e) {
    let left = 0;
    let top = 0;

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
    let parent = refElem.parentNode;
    let next = refElem.nextSibling;

    if (next) {
        return parent.insertBefore(elem, next);
    } else {
        return parent.appendChild(elem);
    }
}

function fixEvent(e) {
    // получить объект событие для IE
    e = e || window.event;

    // добавить pageX/pageY для IE
    if (e.pageX == null && e.clientX != null) {
        let html = document.documentElement;
        let body = document.body;
        e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
        e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
    }

    // добавить which для IE
    if (!e.which && e.button) {
        e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
    }

    return e
}
