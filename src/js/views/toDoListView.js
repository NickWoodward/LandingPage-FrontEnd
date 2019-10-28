import { elements } from './base';
import * as validate from '../validation';

export const getTitle = () => {
    return elements.tdlTitleInput.value;
};

export const clearInputs = () => {
    elements.tdlTitleInput.value = '';
};


export const clearList = () => {
    elements.tdl.innerHTML = '';
};

export const clearMessages = () => {
    const msgElement = document.querySelector('.todolist__message');

    if (msgElement) msgElement.parentElement.removeChild(msgElement);
};

const getListHeight = () => {
    const tdlHeight = elements.tdl.getBoundingClientRect().height;
    const tdlFormHeight = elements.tdlForm.getBoundingClientRect().height;
    const tdlControlsHeight = elements.tdlControls.getBoundingClientRect().height;

    // Get available height (total container height - form height - controls height)
    const availableHeight = tdlHeight - tdlFormHeight - tdlControlsHeight;

    return availableHeight;
};

const calcItemsPerPage = (listHeight, itemHeight) => {
    // Calculate how many items will fit in the available height
    const numItemsPerPage = Math.floor(listHeight / itemHeight);

    return numItemsPerPage;
};

export const calcNumOfPages = (itemLength, itemHeight) => {
    const listHeight = getListHeight();
    const itemsPerPage = calcItemsPerPage(listHeight, itemHeight);

    return Math.ceil(itemLength / itemsPerPage);
};

export const getModalFields = () => {
    return document.querySelector('.edit-modal__input--title').value;
};

export const renderEditModal = item => {
    const markup = `
        <div class="edit-modal">
            <form class="edit-modal__form">
                <div class="edit-modal__control">
                    <label class="edit-modal__label--title edit-modal__label">Title</label>
                    <input class="edit-modal__input--title edit-modal__input" type="text" value="${item.title}">
                </div>
                <input class="edit-modal__submit" type="submit">

            </form>
            <svg class="edit-modal__icon--close edit-modal__icon">
                <use xlink:href="svg/spritesheet.svg#ios-close-outline"></use>
            </svg>
        </div>
    `;

    elements.tdl.insertAdjacentHTML('afterbegin', markup);
};

export const renderItemDetails = item => {
    const markup = `
        <div class="details-modal">
            <div class="details-modal__body">
                <div class="details-modal__control">
                    <label class="details-modal__label--title edit-modal__label">Title:</label>
                    <label class="details-modal__value--title details-modal__value">${item.title}</label>
                </div>
            <div>
            <svg class="details-modal__icon--close details-modal__icon">
                <use xlink:href="svg/spritesheet.svg#ios-close-outline"></use>
            </svg>
        </div>
    `;

    elements.tdl.insertAdjacentHTML('afterbegin', markup);

};

export const renderToDoList = (itemList, itemHeight, page = 1) => {
    console.log('Rendering');
    // Set the list height to the available space
    const listHeight = getListHeight();
    elements.tdlItems.style.height = `${listHeight}px`;

    // Calculate the number of items that'll fit in that space
    const numItemsPerPage = calcItemsPerPage(listHeight, itemHeight);

    // Calculate the start and end points for pagination
    const start = (page - 1) * numItemsPerPage;
    // Use the smaller of list length or the display length
    const temp = itemList.length < numItemsPerPage ? itemList.length : numItemsPerPage;
    const end = page * temp;

    // Remove old pagination controls
    elements.tdlControls.innerHTML = '';

    // Render the pagination controls
    renderPaginationControls(page, itemList.length, numItemsPerPage);

    // Remove placeholder/current items
    elements.tdlItems.innerHTML = '';

    // Render Items
    itemList.slice(start, end).forEach(item => {
        renderItem(item);
    });

    // If the list length is not divisible by the items/page, and it's the last page, add the 'no more items' placeholder
    if (itemList.length % numItemsPerPage !== 0 && page === calcNumOfPages(itemList.length, itemHeight)) renderEndElement();

    // Change the items' heights
    document.querySelectorAll('.todolist__item').forEach(item => {
        item.style.height = `${itemHeight}px`;
    });
};

const renderItem = item => {
    const markup = `
        <li class="todolist__item" data-itemid=${item.id}>
            <div class="todolist__bulletpoint-wrapper">
                <svg class="todolist__icon--bulletpoint todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-arrow-right"></use>
                </svg>
            </div>
            <div class="todolist__item-heading">${item.title}</div>
            <div class="todolist__buttons-wrapper">
                <svg class="todolist__icon--edit todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-compose-outline"></use>
                </svg>
                
                <svg class="todolist__icon--complete todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-checkmark-outline"></use>
                </svg>
                <svg class="todolist__icon--close todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-close-outline"></use>
                </svg>
            </div>
        </li>
    `;

    // <svg class="todolist__flag-icon todolist__icon">
    //     <use xlink: href="svg/spritesheet.svg#ios-flag-outline"></use>
    // </svg >

    elements.tdlItems.insertAdjacentHTML('beforeend', markup);
};

const renderPaginationControls = (page, numOfItems, itemsPerPage) => {

    const pages = Math.ceil(numOfItems / itemsPerPage);
    if (page === 1 && pages > 1) {
        // highlight next button
        renderNavItems('next', page, pages);
    } else if (page === pages && pages > 1) {
        // highlight back button
        renderNavItems('prev', page, pages);
    } else if (page === 1 && page === pages) {
        // highlight neither
        renderNavItems('neither', page, pages);
    } else {
        // hightlight both
        renderNavItems('both', page, pages);
    }
};

/**
 * 
 * @param {string} type - The button(s) to be activated
 * @param {number} page - The current page
 */
const renderNavItems = (type, page, pages) => {
    const markup = `
            <div class="todolist__nav-arrow todolist__nav-arrow--left">
                <svg class=" ${ type === 'prev' ? "todolist__nav-arrow-icon todolist__nav-arrow-icon--active" : (type === 'both' ? "todolist__nav-arrow-icon todolist__nav-arrow-icon--active" : "todolist__nav-arrow-icon")}">
                    <use xlink:href="svg/spritesheet.svg#ios-arrow-left"></use>
                </svg>
            </div>
            <div class="todolist__nav-page-number-wrapper">${renderPageNumbers(page, pages)}</div>
            <div class="todolist__nav-arrow todolist__nav-arrow--right">
                <svg class=" ${ type === 'next' ? "todolist__nav-arrow-icon todolist__nav-arrow-icon--active" : (type === 'both' ? "todolist__nav-arrow-icon todolist__nav-arrow-icon--active" : "todolist__nav-arrow-icon")}">
                    <use xlink:href="svg/spritesheet.svg#ios-arrow-right"></use>
                </svg>
            </div>   
    `;
    elements.tdlControls.insertAdjacentHTML('beforeend', markup);
};


const renderPageNumbers = (page, totalPages) => {
    let markup = '';
    let x = 0;
    let end = totalPages;

    // If the page is 1, the end point is either +2, or the total page # (ie 1 or 2)
    if (page === 1 && page + 2 <= totalPages) {
        end = page + 2;
    }
    // Page > 1
    else if (page > 1 && page + 1 <= totalPages) {
        end = page + 1;
    }

    for (x; x < end; x++) {
        markup += `<div class="${x === page - 1 ? "todolist__nav-page-number--active todolist__nav-page-number" : "todolist__nav-page-number"}" data-goto="${x + 1}">${x + 1}</div>`;
    }

    if (end != totalPages) markup += `<div class="todolist__nav-page-number" data-goto="${totalPages}">...</div>`;

    return markup;
};

const renderEndElement = () => {
    const markup = `
        <div class="todolist__item--end-element">
            No more items to display
        </div>
    `;

    elements.tdlItems.insertAdjacentHTML('beforeend', markup);
};

export const renderMessage = (msg, status, fade) => {
    // Guard against old message if one is still present (shouldn't be)
    const old = document.querySelector('.todolist__message');
    if (old) old.parentElement.removeChild(old);

    const markup = `
        <div class="todolist__message todolist__message${status ? "--ok" : "--err"}">${msg}</div>
    `;

    elements.tdl.insertAdjacentHTML('beforeend', markup);

    if (fade) {
        const message = document.querySelector('.todolist__message');
        // Have to wait to change the opacity, probably due to event queue?
        setTimeout(() => {
            // Change the message opacity
            message.style.opacity = '0';
        }, 100);
    }

    // Removing the message called by transition event listener in app.js
};

export const deleteMessage = element => {
    if (element) {
        element.parentElement.removeChild(element);
    }
};

export const validateListItem = input => {
    return validate.validateListItem(input)
}
