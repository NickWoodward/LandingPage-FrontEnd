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
        toDoListView.renderToDoList(todolist);
    };

    addListItem() {
        let flag = true;
        // Create item
        if (toDoListView.getTitle().length >= 5) {
            const item = {
                title: toDoListView.getTitle(),
                content: 'Dummy Content',
                author: 'Nick',
                completed: false
            }

            // Wipe any previous error messages
            toDoListView.clearErrorMessages();

            // Add to TDL array
            this.toDoList.addItem(item);

            // Then get the TDL list and render
            toDoListView.renderToDoList(this.toDoList.getItemList(), this.itemHeight);

            // Then save the TDL item to the DB
            try {
                this.toDoList.saveListItem(item);
            } catch (err) {
                console.log(err);
                toDoListView.renderError('OH NO! Something went wrong!');
            }

            // **** NB, TODO: Remove item from model array if it doesn't save to DB
        } else {
            toDoListView.renderToDoList(this.toDoList.getItemList(), this.itemHeight);
            toDoListView.renderError('Item length must be greater than 5');
        }
    }

    // Get DB data
    async getTDLData() {
        return await this.toDoList.getData();
    };

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

        window.addEventListener('resize', debounce(function (e) {
            const items = this.toDoList.getItemList();

            toDoListView.renderToDoList(items, this.itemHeight);
        }.bind(this), 400));

    }
}

const ctrl = new Controller(userView);

