function generateRandomNumber() {
    return Math.floor(Math.random() * 1000 + 10000000);
}

module.exports = {
    generateRandomNumber
}