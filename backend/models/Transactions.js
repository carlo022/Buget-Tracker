const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String,
    required: true,
    default: 'other'
   },
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);