/**
 * navbar.ts
 * This file is used to handle the special behaviours of the navbar
 */

/**
 * Puts or removes an "opened" class on the specified item, depending on the "open" value
 * @param item The item to modify
 * @param open The value indicating whether the item must be shown or hidden
 */
function openClose(item:HTMLElement, open: boolean) {
    if(open) {
        if(item.classList) {
            item.classList.add('opened');
        } else {
            item.className = item.className + " opened";
        }
    } else {
        if(item.classList) {
            item.classList.remove('opened');
        } else {
            item.className = item.className.replace(' opened', '');
        }
    }
}

document.getElementById('collapse-button-checkbox').addEventListener('change', function() {
    // I first to do the collapsible menu using pure css, but a bug in android browser forced me to use javascript
    openClose(document.getElementById('collapse-button'), this.checked);
    openClose(document.getElementById('navbar-inner-content'), this.checked);
});
