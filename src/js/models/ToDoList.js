const axios = require('axios');

export default class ToDoList {
    constructor(date) {
        this.date = date;
        this.itemList = [];
    }

    async getData() {
        try {
            const result = await axios('http://127.0.0.1:8080/item-list/items');
            this.itemList = result.data;
            console.log(result);
        } catch(err) {
            console.log(err);
        }
    }

    async addListItem(item) {
        const headers = {
            'Content-Type': 'application/json'
        };
        const data = JSON.stringify({
            title: item.title
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
                console.log(`${response.status} ${response.statusText}`);
            });
        } catch(err) {
            console.log(err.response.data.message);
        } 
    }
}