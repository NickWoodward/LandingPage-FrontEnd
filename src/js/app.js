import DateAndTime from './models/DateAndTime';
import ToDoList from './models/ToDoList';
import * as toDoListView from './views/toDoListView';

import "../assets/meribel-compress.jpg";
import "../assets/svg/sprite.svg";
import "../assets/svg/spritesheet.svg";
import "../sass/main.scss";
import { elements } from './views/base';

const state = {};

// USER CONTROLLER
const userController = () => {
    const userName = 'Nick';
    const greeting = `${new DateAndTime().getTimeOfDay()} ${userName}`;

    elements.greeting.innerHTML = greeting;
};

// TODOLIST CONTROLLER
const listController = async () => {
    if(!state.toDoList) state.toDoList = new ToDoList(); 
    await state.toDoList.getData();
    console.log(state.toDoList.itemList);
    toDoListView.renderToDoListItems(state.toDoList.itemList);

    const response = await state.toDoList.addListItem({title:'Cust'});
};

window.addEventListener('load', function() {
    userController();
    listController();
});
