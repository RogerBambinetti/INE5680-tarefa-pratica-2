import { initServer } from './server/index.js'
import { initClient } from './client/index.js';;


const originalConsoleError = console.error;

const redColor = '\x1b[31m';
const resetColor = '\x1b[0m';

console.error = function () {
    const args = Array.from(arguments);

    if (typeof args[0] === 'string') {
        args[0] = redColor + args[0];
    } else {
        args.unshift(redColor);
    }

    args.push(resetColor);

    return originalConsoleError.apply(console, args);
};


initServer();
initClient();