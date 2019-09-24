import { elements } from './base';

export const renderToDoListItems = itemList => {
    itemList.forEach(item => {
        renderItem(item);
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
                <svg class="todolist__flag-icon todolist__icon">
                    <use xlink:href="svg/spritesheet.svg#ios-flag-outline"></use>
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

    elements.todolist.insertAdjacentHTML('beforeend', markup);
};