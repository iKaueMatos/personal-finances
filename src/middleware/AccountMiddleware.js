module.exports = function AccountMiddleware(request, response, next) {
    const { cpf } = request.params;
    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({error: "Customer not found!"});   
    }

    request.customer = customer;
    return next();
}