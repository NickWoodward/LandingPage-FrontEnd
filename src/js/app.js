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


    updateUserView(username) {
        userView.greetUser(new DateAndTime().getTimeOfDay(), username);
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
        if (err.error) {
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
                    toDoListView.renderMessage('Item Added', true, true);
                })
                .catch(err => toDoListView.renderMessage('Error: The item was not saved'));

        }
        // **** NB, TODO: Remove item from model array if it doesn't save to DB

    }

    async deleteListItem(itemid) {
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

    async editListItem(itemid, title) {

        // Get the item from the local array to populate the new item
        const item = this.toDoList.getItem(itemid);
        // Get the index of the item
        const itemIndex = this.toDoList.getItemIndex(itemid);

        const newItem = {
            id: itemid,
            title: title,
            content: item.content,
            author: item.author,
            completed: item.completed
        }

        // Check if the new item is valid
        const err = toDoListView.validateListItem(newItem);

        // item found && !err
        if (item && !err.error) {
            // Save to DB
            await this.toDoList.editListItem(newItem)
                .then(response => {
                    // Replace the item with the new item
                    this.toDoList.getItemList()[itemIndex] = newItem;
                    // Render the new list
                    toDoListView.renderToDoList(this.toDoList.getItemList(), this.itemHeight);
                    toDoListView.renderMessage('Item Edited', true, true);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    // Get DB data
    async getTDLData() {
        return await this.toDoList.getData(window.localStorage.getItem('token'));
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
            const user = window.localStorage.getItem('username');

            if(user) {
                // Update the User View
                this.updateUserView(user);
                // Change login nav item
                toDoListView.updateLoginView();
            }
                    
            // Get TDL Model data from the DB
            this.getTDLData()
                .then(() => {
                    // Get the todolist where the DB data was stored
                    const items = this.toDoList.getItemList();

                    toDoListView.renderToDoList(items, this.itemHeight);
                })
                .catch(err => {
                    console.log(err)
                });
        }.bind(this));

        // Add listener for the login modal
        document.querySelector('body').addEventListener('click', function(e) {
            // LOGIN MODAL
            const loginModalBackground = e.target.closest('.login-modal-background');
            const loginModal = e.target.closest('.login-modal');

            // LOGIN SUBMIT BTN
            const loginModalSubmitBtn = e.target.closest('.login-modal__submit-btn');

            // SUBMIT LOGIN MODAL
            if(loginModalSubmitBtn) {
                e.preventDefault();

                // Frontend validation
                const login = toDoListView.getLoginDetails();

                if(login.error) {
                    toDoListView.displayLoginMessage(login.error);
                // Login
                } else {
                    this.toDoList.login(login.email, login.password)
                        .then(res => {
                            window.localStorage.setItem('username', res.data.username);
                            // Display login confirmation
                            toDoListView.displayLoginMessage(res.data.message);
                            // Remove the login form
                            toDoListView.removeLogin();
                            // Update view
                            toDoListView.updateLoginView();
                            this.updateUserView(res.data.username);
                        })
                        .catch(err => {
                            toDoListView.displayLoginMessage('Error: ' + err.message);
                        });
                }
            } 


            // REMOVE LOGIN MODAL
            if(loginModalBackground && !loginModal)
                toDoListView.removeLogin();

            
        }.bind(this));

        // Add listener to TDL form submit
        elements.tdlForm.addEventListener('submit', function (e) {
            e.preventDefault();
            this.addListItem();

        }.bind(this));

        // Add header nav listeners
        elements.header.addEventListener('click', function(e) {
            // Login
            const loginBtn = e.target.closest('.nav--header__login');
            const logoutBtn = e.target.closest('.nav--header__logout');

            if(loginBtn) {
                toDoListView.renderLogin();
            } else if(logoutBtn) {
                this.updateUserView();
                toDoListView.updateLoginView();
            }
        }.bind(this));

 

        // Add listeners to list items, item controls, modals and modal controls
        elements.tdl.addEventListener('click', function (e) {

            // List Item / Controls
            const listItem = e.target.closest('.todolist__item');
            const deleteBtn = e.target.closest('.todolist__icon--close');
            const editBtn = e.target.closest('.todolist__icon--edit');

            // Edit Modal / Controls
            const editModal = e.target.closest('.edit-modal');
            const editModalClose = e.target.closest('.edit-modal__icon--close');
            const editModalSubmit = e.target.closest('.edit-modal__submit');

            // Details Modal / Controls
            const detailsModal = e.target.closest('.details-modal');
            const detailsModalClose = e.target.closest('.details-modal__icon--close');

            // ITEM EVENT
            if (listItem) {
                // Set current itemid (instance variable for access in modals)
                this.currentItemid = listItem.dataset.itemid;
                // Get the item from the itemlist array
                const item = this.toDoList.getItem(this.currentItemid);

                // Delete button
                if (deleteBtn) {
                    if (this.currentItemid) this.deleteListItem(this.currentItemid);

                    // Edit button
                } else if (editBtn) {
                    // Render the edit modal with the item
                    toDoListView.renderEditModal(item);

                    // Anywhere else (open details modal)
                } else {
                    e.preventDefault();
                    toDoListView.renderItemDetails(item);
                }

                // EDIT MODAL EVENT
            } else if (editModal) {
                // Submit button
                if (editModalSubmit) {
                    e.preventDefault();

                    // Get form data
                    const modalTitle = toDoListView.getModalFields();

                    // Use the controller's current item property to edit the correct list item
                    if (this.currentItemid) this.editListItem(this.currentItemid, modalTitle);

                    // Remove the edit modal
                    editModal.parentElement.removeChild(editModal);

                    // Close button clicked
                } else if (editModalClose) {
                    // Remove the edit modal
                    editModal.parentElement.removeChild(editModal);
                }

            // DETAILS MODAL EVENT
            } else if (detailsModalClose) {
                detailsModal.parentElement.removeChild(detailsModal);
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

