import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { addTransaction } from "../features/budget/budgetSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CATEGORIES } from "../constants/categories";

const AddTransaction = () => {
  const [type, setType] = useState("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const [category, setCategory] = useState(CATEGORIES[0]);

  // FIX 1: HandleSubmit must be INSIDE the component to access state and dispatch
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || amount <= 0) {
      return toast.error(
        "Please enter a valid description and amount greater than 0.",
      );
    }

    // FIX: Wrap the data in a single object { }
    // Also adding a date field so the backend doesn't complain
    const transactionData = {
      name,
      amount: Number(amount), // Ensure it's a number
      type,
      category,
      date: new Date().toLocaleDateString(),
    };

    dispatch(addTransaction(transactionData));

    setName("");
    setAmount("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>

      {/* Toggle Switch */}
      <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
        <button
          type="button" // Important: prevents accidental form submission
          onClick={() => setType("expense")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "expense" ? "bg-white shadow-sm text-rose-600" : "text-slate-500"}`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "income" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500"}`}
        >
          Income
        </button>
      </div>

      {/* FIX 2: Place onSubmit on the form tag */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <input
            type="text"
            placeholder="Rent, Groceries, Salary..."
            className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-none transition-all ${
              !name && "border-rose-300" // Visual hint
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="0.00"
            className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-none transition-all ${
              !amount && "border-rose-300"
            }`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* FIX 3: The button triggers the form's onSubmit automatically if type is submit */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold text-white transition-transform active:scale-95 flex items-center justify-center gap-2 ${type === "expense" ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
        >
          <PlusCircle size={20} />
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
