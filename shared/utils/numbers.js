const financialNum = (num) => Number(num.toFixed(2));
const sumArray = (arr) => arr.reduce((acc, num) => acc + num, 0);

module.exports = {
    financialNum,
    sumArray,
};
