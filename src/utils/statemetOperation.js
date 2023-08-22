module.exports = function createStatementOperation(description, amount, type) {
    return {
        description,
        amount,
        created_at: new Date(),
        type
    };
}