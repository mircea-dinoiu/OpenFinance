const path = require('path');

module.exports = {
    basePath(string = '') {
        return path.join(__dirname, '../', string);
    }
};