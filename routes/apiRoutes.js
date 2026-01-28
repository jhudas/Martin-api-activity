//Get Routes for transactions with filtering options
const express = require('express');
const router = express.Router();
const data = require('../models/transactionModel');

router.get('/transactions', (req, res) => {
    const { type, amount, description, date} = req.query;

    let filteredTransactions = data
        .filter ((transaction) => !type || transaction.type.toLowerCase() === type.toLowerCase(),
    )
        .filter ((transaction) => !amount || transaction.amount <= parseFloat (amount))
        .filter ((transaction) => !description || transaction.description.toLowerCase().includes(description.toLowerCase()),
    )
        .filter ((transaction) =>
            !date|| transaction.date === date
    );

    return filteredTransactions.length  === 0
        ? res.status(404).json({ 
            status: '404',
            message: 'No transactions found matching the criteria.',

         })
        :res.status(200).json({
            status: '200',
            message: 'Retrieved transactions successfully.',
            data: filteredTransactions,
        });

});

//create a new transaction
router.post('/transactions', (req, res) => {
    const { description, amount, type, date } = req.body || {};
    // Validation: Check if required fields are missing
    if (!description || !amount || !type || !date) {
        return res.status(400).json({
            status: '400',
            message:
            'Bad Request: Description, Amount, Type, and Date are required fields.',
        });
    }

    const newTransaction = { id: data.length + 1, description, amount, type, date };
    data.push(newTransaction);
    return res.status(201).json({
        status: '201',
        message: 'Transaction created successfully.',
        data: newTransaction,
    });

});

//Update Routes for transactions by ID
router.put('/transactions/:id', (req, res) => {
    const transactionId = parseInt(req.params.id);
    const index = data.findIndex((t) => t.id === transactionId);

    if (index === -1) {
        return res.status(404).json({
            status: '404',
            message: `Transaction with ID ${transactionId} not found.`,
        });
    }

    data[index] = { ...data[index], ...req.body };
    return res.status(200).json({
        status: '200',
        message: 'Transaction updated successfully.',
        data: data[index],
    });
});


//Delete Routes for transactions by ID
router.delete('/transactions/:id', (req, res) => {
    const transactionId = parseInt(req.params.id);
    const index = data.findIndex((t) => t.id === transactionId);

    if (index === -1) {
        return res.status(404).json({
            status: '404',
            message: `Transaction with ID ${transactionId} not found.`,
        });
    }

    data.splice(index, 1);
    return res.status(200).json({
        status: '200',
        message: 'Transaction deleted successfully.',
    });

});

module.exports = router;
