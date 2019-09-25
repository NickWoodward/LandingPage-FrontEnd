import { elements } from './base';

export const greetUser = (timeOfDay) => {
    const userName = 'Nick';
    const greeting = `${timeOfDay} ${userName}`;

    elements.greeting.innerHTML = greeting;
};