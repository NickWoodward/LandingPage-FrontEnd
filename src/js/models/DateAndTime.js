export default class DateAndTime {
    constructor(x){
        this.x = x;
    }

    getDateAndTime(){
        const date = new Date();
        const day = date.getDay();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${day} ${hours} ${minutes} ${seconds}`;
    }

    getTimeOfDay() {
        const date = new Date();
        const hours = date.getHours();

        if(hours <= 12) return 'Good Morning ';
        else if (hours >= 18) return 'Good Evening';
        else if(hours >= 12) return 'Good Afternoon';
    }
}