const Transaction = require('../models/Transactions');

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
  const { name, amount, type, category, date } = req.body;

  if (!name || !amount || !type || !category) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const transaction = await Transaction.create({
      user: req.user.id, // Links transaction to the logged-in user
      name,
      amount,
      type,
      category,
      date
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if the transaction belongs to the user trying to delete it
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Not found' });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};