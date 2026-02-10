  const express = require('express');
  const router = express.Router();
  const data = require('../models/transactionModel');
const transactions = require('../models/transactionModel');
const { parse } = require('dotenv');

  router.get('/transactions', (req, res) => {
    const { type, amount, description, date } = req.query;

    let filteredtransactions = data
        .filter(
            (transaction) =>
                !type || transaction.type.toLowerCase() === type.toLowerCase(),
        )
        .filter((transaction) => !amount || transaction.amount <= parseFloat(amount))
        .filter(
            (transaction) => !description || transaction.description.toLowerCase().includes(description.toLowerCase()),
        )
        .filter((transaction) => !date || transaction.date === date);

    return filteredtransactions.length === 0
        ? res.status(404).json({
            status: '404',
            message: 'No transactions found matching the criteria.'
        }) 
        : res.status(200).json({
            status: '200',
            message: 'Retrieved transactions successfully.',
            data: filteredtransactions
        });
    });

    router.post('/transactions', (req, res) => {
        const { description, amount, type, date } = req.body || {};
        //validation check
        if (!description || !amount || !type || !date) {
            return res.status(400).json({
                status: '400',
                message:
                    'Bad Request: description, amount, type, and date are required for the transaction.',
            });
        }

        const newItem = { id: data.length + 1, description, amount, type, date };
        data.push(newItem);
        res.status(201).json({
            status: '201',
            message: 'Transaction created successfully.',
            data: newItem,
        });
    });

    router.put('/transactions/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const index = data.findIndex((t) => t.id === id);
        if (index === -1) {
            return res.status(404).json({
                status: '404',
                message: `Transaction with ID ${id} not found.`,
            });
        }

        data[index] = { id, ...req.body };
        res.status(200).json({
            status: '200',
            message: 'Transaction updated successfully.',
            data: data[index],
        });
    });

    router.delete('/transactions/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const index = data.findIndex((t) => t.id === id);

        if (index === -1) {
            return res.status(404).json({
                status: '404',
                message: `Transaction with ID ${id} not found.`,
            });
        }

        data.splice(index, 1);
        res.status(203).json({
            status: '203',
            message: 'Transaction deleted successfully.',
        });
    });

    module.exports = router;