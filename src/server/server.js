const express = require('express');
const routes = require('../router/router');
const AccountMiddleware = require('../middleware/AccountMiddleware');
const app = express();
const port = 3002;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});

