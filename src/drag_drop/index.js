'use strict';
// drag and drop classes should be specified in the initializer
// drop container should be the enclosing element
// drag container goes inside the drop container

const TEMPORARY_DRAG_ID = 'temporary-drag-id';
const dropBox = document.createElement('div');
dropBox.classList.add('drop-box');

function dragInitialization(element, {drag = '.drag', drop = '.drop'}) {
    element.setAttribute('draggable', true);

    element.addEventListener('dragstart', function(event) {
        dropBox.style.height = `${element.clientHeight}px`;

        let id = element.getAttribute('id');
        event.dataTransfer.setData('text/plain', id);
        element.setAttribute('id', TEMPORARY_DRAG_ID);
        setTimeout(() => {
            element.classList.add('drag-active');
            element.parentElement.insertBefore(dropBox, element);
        }, 0);
    });

    element.addEventListener('dragend', function(event) {
        element.classList.remove('drag-active');
        let id = event.dataTransfer.getData('text/plain');
        element.setAttribute('id', id);

        if(dropBox.parentElement != null) {
            dropBox.replaceWith(element);
        }
    });

    element.addEventListener('drag', function(event) {
        let overElements = document.elementsFromPoint(event.clientX, event.clientY);
        let dropContainers = Array.from(document.querySelectorAll(drop));

        if(overElements.every(overElement => dropContainers.indexOf(overElement) == -1)) {
            let parent = dropBox.parentElement;
            parent && parent.removeChild(dropBox);
        }
    });
}

function dropInitialization(element, {drag = '.drag', drop = '.drop'}) {
    element.ondragover = (event) => {
        event.preventDefault();
        let overElements = event.path;
        let dragElement = document.getElementById(TEMPORARY_DRAG_ID);

        for(let overElement of overElements) {
            if(overElement == dropBox) {
                break;
            }else if(Array.from(element.querySelectorAll(drag)).indexOf(overElement) != -1) {
                if(dropBox.parentElement == element) element.removeChild(dropBox);

                let rect = overElement.getBoundingClientRect();
                let y = event.clientY - rect.top;
                
                if(y > rect.height / 2) {
                    element.insertBefore(dropBox, overElement);
                    element.removeChild(overElement);
                    element.insertBefore(overElement, dropBox);
                }else{
                    element.insertBefore(dropBox, overElement);
                }

                break;
            }else {
                let children = element.querySelectorAll(drag);
                if(children.length == 0 || (children.length == 1 && children[0] == dragElement))
                element.appendChild(dropBox);
                break;
            }
        }
    }
}

function mutationCallback(mutations) {
    for(let mutation of mutations) {
        if(mutation.type == 'childList') {
            
        }
    }
}

function initialize({drag = '.drag', drop = '.drop'}) {
    document.querySelectorAll(drag).forEach(element => {
        dragInitialization(element, {drag, drop});
    });

    document.querySelectorAll(drop).forEach(element => {
        dropInitialization(element, {drag, drop});
    });

    let observer = new MutationObserver(mutationCallback);
    let config = { childList: true }
    document.querySelectorAll(drop).forEach(element => observer.observe(element, config));
}

//dropBox not hidden
//dragBox retracting to its origin parent