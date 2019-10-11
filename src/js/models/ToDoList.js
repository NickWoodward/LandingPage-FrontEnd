const axios = require('axios');

export default class ToDoList {
    constructor(date) {
        this.date = date;
        this.itemList = [];
    }

    // UPDATE/RETRIEVE DATA FROM MODEL
    getItemList() {
        return this.itemList;
    }

    addItem(item) {
        console.log('Adding Item');

        this.itemList.push(item);
    }


    // UPDATE/RETRIEVE DATA ON/FROM SERVER
    async getData() {
        try {
            const result = await axios('http://127.0.0.1:8080/item-list/items');
            this.itemList = result.data;
        } catch(err) {
            console.log(err);
        }
    }

    async saveListItem(item) {
        const headers = {
            'Content-Type': 'application/json'
        };

        const data = JSON.stringify({
            title: item.title,
            content: item.content,
            author: item.author,
            completed: item.completed
        });

        try {
            await axios.post(
                'http://127.0.0.1:8080/item-list/item', 
                data,
                {
                headers: headers
                }
            )
            .then(response => {
                console.log(`${response.status}: ${response.data.message}`);
            });
        } catch(err) {
            console.log(err.response.data.message);
        } 
    }
}