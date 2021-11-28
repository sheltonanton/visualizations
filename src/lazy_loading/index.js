/*
    lazy loading the list - how to do this
    1. get the last of the item in the list
    2. use intersection observer with the required threshold added at a particular position to come into view
    3. when it comes into view, trigger a loader
*/

function initializeLazyLoading(element, loader) {
    function observeLastElement(intersectionObserver, element) {
        if(element.childNodes.length > 0) {
            let lastElement = Array.from(element.childNodes)[element.childNodes.length - 1];
            intersectionObserver.observe(lastElement);
            return lastElement;
        }
        
        return null;
    }
    
    const mutationOptions = {
        childList: true
    }

    const intersectionOptions = {
        root: element
    }

    const mutationObserver = new MutationObserver(mutationCallback);
    const intersectionObserver = new IntersectionObserver(intersectionCallback, intersectionOptions);

    mutationObserver.observe(element, mutationOptions);
    let lastElement = observeLastElement(intersectionObserver, element);

    function mutationCallback(mutations, observer) {
        for(let mutation of mutations) {
            if(mutation.type == 'childList') {
                intersectionObserver.unobserve(lastElement);
                lastElement = observeLastElement(intersectionObserver, element);
            }
        }
    }
    
    function intersectionCallback(intersectionEntries, observer) {
        for(let entry of intersectionEntries) {
            if(entry.isIntersecting) {
                loader();
            }
        }
    }
}