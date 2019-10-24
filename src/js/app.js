// MODELS
import DateAndTime from './models/DateAndTime';
import ToDoList from './models/ToDoList';

// VIEWS
import * as toDoListView from './views/toDoListView';
import * as userView from './views/userView';

import debounce from 'lodash.debounce';
import "../assets/meribel-compress.jpg";
import "../assets/svg/sprite.svg";
import "../assets/svg/spritesheet.svg";
import "../sass/main.scss";
import { elements } from './views/base';
import uniqid from 'uniqid';

class Controller {
    // TODO remove imports? ** Move controller out of this file into its own
    constructor() {
        this.toDoList = new ToDoList();
        // Gets the item height from the sass through an html placeholder
        // rather than setting it in the JS
        this.itemHeight = document.querySelector('.todolist__item').getBoundingClientRect().height;
        this.init();
    };


    updateUserView() {
        userView.greetUser(new DateAndTime().getTimeOfDay());
    };

    updateTDLView(todolist) {
        toDoListView.renderToDoList(todolist, this.itemHeight);
    };

    addListItem() {

            const item = {
                id: uniqid(),
                title: toDoListView.getTitle(),
                content: 'Dummy Content',
                author: 'Nick',
                completed: false
            }

            // Validate the item input
            const err = toDoListView.validateListItem(item);
            if(err.error) {
                const errorStr = err.error.toString();

                const index = errorStr.indexOf('"');

                // Remove the 'ValidationError' prefix
                let msg = errorStr.slice(index, errorStr.length);

                // Capitalise the fieldname
                msg = msg[0] + msg[1].toUpperCase() + msg.slice(2);
                
                // Render the error message
                toDoListView.renderMessage(msg, false, true);

            } else {

                // Wipe inputs
                toDoListView.clearInputs();

                // Wipe any previous error messages
                toDoListView.clearMessages();

                // Add to TDL array
                this.toDoList.addItem(item);

                // Calc how many pages
                const numPages = toDoListView.calcNumOfPages(this.toDoList.itemList.length, this.itemHeight);

                // Then get the TDL list and render on the last page
                toDoListView.renderToDoList(this.toDoList.getItemList(), this.itemHeight, numPages);

                // Then save the TDL item to the DB
                this.toDoList.saveListItem(item)
                    .then(response => {
                        console.log(response)
                        toDoListView.renderMessage('Item Added', true, true);
                    })
                    .catch(err => toDoListView.renderMessage('Error: The item was not saved'));
                
                } 
            // **** NB, TODO: Remove item from model array if it doesn't save to DB

    }

    async deleteListItem(itemid) {
        console.log(itemid);
        // Remove item from the local list
        this.toDoList.removeItem(itemid);
        // Remove item from the database

        await this.toDoList.deleteListItem(itemid)
            .then(response => {
                toDoListView.renderToDoList(this.toDoList.getItemList(), this.itemHeight);
                toDoListView.renderMessage('Item Deleted', false, true);
            })
            .catch(err => {
                console.log('Error in App/DeleteItem', err);
            });
    }

    async editListItem(itemid) {
        console.log(itemid);

        // Get the item from the local array
        let item = this.toDoList.getItem(itemid);

        console.log(item);
        // Create an item with either the form data if present, or the item data
        const newItem = {
            id: itemid,
            title: item.title,
            content: item.content,
            author: item.author,
            completed: item.completed
        }

        // Check if the new item is valid
        const err = toDoListView.validateListItem(newItem);

        // item found && !err
        if (item && !err.error) {
            // Save to DB
            await this.toDoList.editListItem(item)
                .then(response => {
                    console.log(response);

                    // replace the item with the new item
                    item = {...newItem};
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    // Get DB data
    async getTDLData() {
        return await this.toDoList.getData();
    };

    // David Walsh function for detecting needed prefixes
    whichTransitionEvent() {
        let t;
        const el = document.createElement('fake-element');
        const transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }

        for (t in transitions) {
            if (el.style[t] !== undefined)
                return transitions[t];
        }
    }

    // Initialise
    init() {

        // Add listeners
        window.addEventListener('load', function () {

            // Update the User View
            this.updateUserView();

            // Get TDL Model data from the DB
            this.getTDLData()
                .then(() => {
                    // Get the todolist where the DB data was stored
                    const items = this.toDoList.getItemList();

                    // Calculate and display the number of items that can fit in the list 
                    // toDoListView.calculateNumOfItems(items.length, '3rem');


                    toDoListView.renderToDoList(items, this.itemHeight);
                })
                .catch(err => console.log(err));
        }.bind(this));

        // Add listener to TDL form submit
        elements.tdlForm.addEventListener('submit', function (e) {
            e.preventDefault();
            this.addListItem();

        }.bind(this));

        // Add listeners to list items
        elements.tdl.addEventListener('click', function (e) {
            const closeBtn = e.target.closest('.todolist__icon--close');
            const editBtn = e.target.closest('.todolist__icon--edit');
            const editModal = e.target.closest('.edit-modal');

            // Close button clicked
            if (closeBtn) {
                // Get the itemid
                const itemid = closeBtn.closest('.todolist__item').dataset.itemid;
                console.log(`IN THE LISTENER: ${itemid}`);
                this.deleteListItem(itemid);
            } else if (editBtn) {
                const itemid = editBtn.closest('.todolist__item').dataset.itemid;
                const item = this.toDoList.getItem(itemid);
                toDoListView.renderEditModal(item);
            } else if (editModal) {
                editModal.parentElement.removeChild(editModal);
            }

        }.bind(this));

        // Add listeners to pagination nav items
        elements.tdlControls.addEventListener('click', function (e) {
            const navItem = e.target.closest('.todolist__nav-page-number');
            const navArrow = e.target.closest('.todolist__nav-arrow-icon--active');
            const listItems = this.toDoList.getItemList();

            // re-render the list if a nav item is clicked and it isn't the currently active element
            if (navItem && !navItem.classList.contains('todolist__nav-page-number--active')) {
                const goto = parseInt(navItem.dataset.goto, 10);
                toDoListView.renderToDoList(listItems, this.itemHeight, goto);
            }

            if (navArrow) {
                // Get the active page number
                const activeNavNumber = document.querySelector('.todolist__nav-page-number--active').dataset.goto;
                // See if the arrow clicked is the right or left arrow
                const next = navArrow.parentElement.classList.contains('todolist__nav-arrow--right');

                if (activeNavNumber) {
                    // Set the target page number
                    const goto = parseInt(activeNavNumber, 10) + (next ? 1 : -1);
                    // Render the page
                    toDoListView.renderToDoList(listItems, this.itemHeight, goto);
                }
            }

        }.bind(this));


        // Rerender TDL on resize
        window.addEventListener('resize', debounce(function (e) {
            const items = this.toDoList.getItemList();

            toDoListView.renderToDoList(items, this.itemHeight);
        }.bind(this), 400));


        // Add transitionend event listener for the list elements
        window.addEventListener(this.whichTransitionEvent(), function (e) {
            if (e.target.classList.contains('todolist__message')) {
                toDoListView.deleteMessage(e.target);
            }
        });
    }
}

const ctrl = new Controller(userView);

