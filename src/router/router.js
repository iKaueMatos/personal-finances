/* Middlewares */
const AccountMiddleware = require('../middleware/AccountMiddleware.js');

/* Utils */
const getBalance = require('../utils/balance.js');
const CreateStatementOperation = require('../utils/statemetOperation.js');

const express = require('express');
const { v4: uuidV4 } = require("uuid");
const router = express.Router();
const customers = [];

router.post("/account", (request, response) => {
    const {cpf, name} = request.body; 
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists){
        return response.status(400).json({error: "Customer already exists!"});
    }

    customers.push({
        id: uuidV4(),
        cpf,
        name,
        statement: []
    });
    
    return response.status(201).send();
});

router.post("/deposit", AccountMiddleware, (request, response) => {
    const { description, amount } = request.body;
    //Recuperation
    const {customer} = request;
    const statementOperation = CreateStatementOperation(description, amount, "credit");
   
    customer.statement.push(statementOperation);
    return response.status(201).send();
});

router.post("/withdraw", AccountMiddleware, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;
    const balance = getBalance(customer.statement);

    if (balance < amount){
        return response.status(400).json({error: "Insufficient funds!"});
    }
    
    const statementOperation = CreateStatementOperation(description, amount, "debit");
    customer.statement.push(statementOperation);
    return response.status(201).send(); 
});

router.get("/statement", AccountMiddleware,(request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

router.get("/statement/date", AccountMiddleware,(request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");
    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString());

    return response.json(statement);
});

router.put("/account", AccountMiddleware, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;
    return response.status(201).send();
});

router.get("/account", AccountMiddleware, (request, response) => {
    const { customer } = request;

    return response.json(customer);
});

router.delete("/account", AccountMiddleware, (request, response) => {
    const { customer } = request;

    //Splice
    customers.splice(customer, 1);
    return response.status(204).json(customers);
});

router.get("/balance", AccountMiddleware, (request, response) => {
    const { customer } = request;
    const balance = getBalance(customer.statement);

    return response.json(balance);
});

module.exports = router;
