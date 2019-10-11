import { elements } from './base';

export const getTitle = () => {
    return elements.tdlTitleInput.value;
};


export const clearList = () => {
    elements.tdl.innerHTML = '';
};

export const clearErrorMessages = () => {
    elements.tdlMsg.innerHTML = '';
};

const getListHeight = () => {
    const tdlHeight = elements.tdl.getBoundingClientRect().height;
    const tdlFormHeight = elements.tdlForm.getBoundingClientRect().height;
    const tdlControlsHeight = elements.tdlControls.getBoundingClientRect().height;

    // Get available height (total container height - form height - controls height)
    const availableHeight = tdlHeight - tdlFormHeight - tdlControlsHeight;

    return availableHeight;
};

const calcNumDisplayItems = (listLength, listHeight, itemHeight) => {
    // Calculate how many items will fit in the available height
    const numItemsPerPage = Math.floor(listHeight / itemHeight);

    return numItemsPerPage;
};

export const renderToDoList = (itemList, itemHeight, page = 1) => {
    console.log('rendering: ', itemList);
    // Set the list height to the available space
    const listHeight = getListHeight();
    elements.tdlItems.style.height = `${listHeight}px`;

    // Calculate the number of items that'll fit in that space
    const numItemsPerPage = calcNumDisplayItems(itemList.length, listHeight, itemHeight);

    console.log(`Number of items that fit: ${numItemsPerPage}`)

    // Calculate the start and end points for pagination
    const start = (page - 1) * numItemsPerPage;
    // Use the smaller of list length or the display length
    const temp = itemList.length < numItemsPerPage ? itemList.length : numItemsPerPage;
    const end = page * temp;

    // Remove old pagination controls
    elements.tdlControls.innerHTML = '';

    // Render the pagination controls
    renderPaginationControls(page, itemList.length, numItemsPerPage);

    console.log(`Start of list: ${start}, End of list: ${end}`);

    // Remove placeholder/current items
    elements.tdlItems.innerHTML = '';

    // Render Items
    itemList.slice(start, end).forEach(item => {
        renderItem(item);
    });

    // If the num of items able to fit in the available space > the num of items, render a 'no more items' element
    if (numItemsPerPage > itemList.length) renderEndElement();

    // Change the items' heights
    document.querySelectorAll('.todolist__item').forEach(item => {
        item.style.height = `${itemHeight}px`;
    });
};

const renderItem = item => {
    const markup = `
        <li class="todolist__item">
            <div class="todolist__bulletpoint-wrapper">
                <svg class="todolist__icon--bulletpoint todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-arrow-right"></use>
                </svg>
            </div>
            <div class="todolist__item-heading">${item.title}</div>
            <div class="todolist__buttons-wrapper">
                <svg class="todolist__edit-icon todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-compose-outline"></use>
                </svg>
                
                <svg class="todolist__complete-icon todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-checkmark-outline"></use>
                </svg>
                <svg class="todolist__close-icon todolist__icon">
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
    console.log(pages);
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
    let markup;

    // Single page
    if (page === 1 && totalPages === 1) {
        markup = "<div class='todolist__nav-page-number--active todolist__nav-page-number'>1</div>";
        // 2 pages, 1st page current
    } else if (page === 1 && totalPages === 2) {
        markup = `
            <div class="todolist__nav-page-number--active todolist__nav-page-number">1</div>
            <div class="todolist__nav-page-number">2</div>
        `;
        // 2 pages, 2nd page current
    } else if (page == 2 && totalPages === 2) {
        markup = `
            <div class="todolist__nav-page-number">1</div>
            <div class="todolist__nav-page-number--active todolist__nav-page-number">2</div>
        `;
        // >= 3 pages, 1st page current
    } else if (page === 1 && totalPages >= 3) {
        markup = `
            <div class="todolist__nav-page-number--active todolist__nav-page-number">1</div>
            <div class="todolist__nav-page-number">2</div>
            <div class="todolist__nav-page-number">3</div>
            ${totalPages > page ? "<div class='todolist__nav-page-number'>...</div>" : ""}
        `;
        // current page is last page
    } else if (page === totalPages) {
        markup = `
            <div class="todolist__nav-page-number--active todolist__nav-page-number">${page - 2}</div>
            <div class="todolist__nav-page-number">${page - 1}</div>
            <div class="todolist__nav-page-number">${page}</div>
        `;
        // normal logic
    } else {
        markup = `
            <div class="todolist__nav-page-number">${page - 1}</div>
            <div class="todolist__nav-page-number--active todolist__nav-page-number">${page}</div>
            <div class="todolist__nav-page-number">${page + 1}</div>
            ${totalPages > page ? "<div class='todolist__nav-page-number'>...</div>" : ""}
        `;
    }

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

export const renderError = msg => {
    const markup = `
        <p>${msg}</p>
    `;

    elements.tdlMsg.insertAdjacentHTML('beforeend', markup);
};