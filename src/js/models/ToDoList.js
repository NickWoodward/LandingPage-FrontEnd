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
        this.itemList.push(item);
    }

    removeItem(itemid) {
        const index = this.itemList.findIndex(item => item.id === itemid);

        // Remove the item from the list array
        this.itemList.splice(index, 1);
    }

    getItem(itemid) {
        return this.itemList.find(item => item.id === itemid);
    }

    getItemIndex(itemid) {
        return this.itemList.findIndex(item => item.id === itemid);
    }

    updateItem(itemid) {

    }


    // UPDATE/RETRIEVE DATA ON/FROM SERVER
    async getData() {
        try {
            const result = await axios('http://127.0.0.1:8080/item-list/items');
            this.itemList = result.data;
        } catch (err) {
            console.log(err);
        }
    }

    async saveListItem(item) {
        const headers = {
            'Content-Type': 'application/json'
        };

        const data = JSON.stringify({
            id: item.id,
            title: item.title,
            content: item.content,
            author: item.author,
            completed: item.completed
        });

        try {
            let response = await axios.post(
                'http://127.0.0.1:8080/item-list/item',
                data,
                {
                    headers: headers
                }
            );

            console.log(`(${response.status}) ${response.data.message}`);

        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    async deleteListItem(itemid) {
        try {
            let response = await axios.delete('http://127.0.0.1:8080/item-list/items/' + itemid);
            console.log(`(${response.status}) ${response.data.message}`);

        } catch (err) {
            console.log(err);
        }
    }

    async editListItem(item) {
        const id = item.id;
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
            let response = await axios.put('http://127.0.0.1:8080/item-list/item/' + id, data, { headers })
            console.log(`(${response.status}) ${response.data.message}`);

        } catch (err) {
            console.log(err);
        }
    }

    login(email, password) {

        const headers = {
            'Content-Type': 'application/json'
        };

        const data = JSON.stringify({
            email: email,
            password: password
        });

        return axios.post('http://127.0.0.1:8080/auth/login', data, { headers })
            .then(res => {
                res.data.message = 'Logged in successful';
                return Promise.resolve(res);
            })
            .catch(err => {
                // Server responded with status code outside 2xx
                if (err.response) {
                    // throw new Error(err.response.data.message);
                    return Promise.reject(new Error(err.response.data.message));
                // Request was made but no response received
                } else if (err.request) {
                    return Promise.reject(new Error('No response'));
                    // Something went wrong setting up the request
                } else {
                    return Promise.reject(err);
                }
            });

    }
}

