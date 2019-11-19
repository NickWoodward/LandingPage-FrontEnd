import { elements } from './base';

export const greetUser = (timeOfDay, userName = '') => {
    const greeting = `${timeOfDay} ${userName}`;

    elements.greeting.textContent = greeting;
};