const fs = require('fs');

const hello = 'Hello world';

fs.appendFile("task02.txt", `${hello}\n`, err => {
    if (err) {
        console.error(err);
    }
});
