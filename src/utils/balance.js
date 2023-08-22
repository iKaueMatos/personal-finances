module.exports = function getBalance(statement) {
   const balance = statement.reduce((accumulator, operation) => {
        let validation = operation.type === 'credit' ? accumulator + operation.amount : accumulator - operation.amount;
        return validation;
    }, 0);

    return balance;
}