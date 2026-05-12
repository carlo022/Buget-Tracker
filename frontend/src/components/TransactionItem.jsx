import React, { useState } from "react";
import { CATEGORIES } from "../constants/categories";
import {
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  deleteTransaction,
  updateTransaction,
} from "../features/budget/budgetSlice";

const TransactionItem = ({ _id, name, amount, type, category, date }) => {
  const dispatch = useDispatch();
  const isIncome = type === "income";

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name, amount, category });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(_id));
    }
  };

  const handleUpdate = () => {
    const rawAmount = Number(String(editData.amount).replace(/,/g, ""));
    dispatch(
      updateTransaction({
        id: _id,
        name: editData.name,
        amount: rawAmount,
        category: editData.category,
      })
    );
    setIsEditing(false);
  };

  return (
    <div className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0 gap-3">
      {/* LEFT SIDE: Icon and Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`p-2 rounded-full shrink-0 ${
            isIncome ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
          }`}
        >
          {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-1 w-full max-w-[150px]">
            <input
              className="bg-white border border-indigo-200 rounded px-2 py-1 text-sm font-semibold outline-none"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              autoFocus
            />
            <select
              className="bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none"
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">{name}</p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-slate-400">{date}</p>
              <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase">
                {category}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Amount and Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="bg-white border border-indigo-200 rounded px-2 py-1 text-sm font-bold w-20 text-right outline-none"
              value={editData.amount}
              onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
            />
            <button onClick={handleUpdate} className="text-emerald-500 p-1">
              <Check size={18} />
            </button>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 p-1">
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <span className={`font-bold whitespace-nowrap ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
              {isIncome ? "+" : "-"}${Number(amount).toLocaleString()}
            </span>

            {/* Action Buttons: simplified and responsive */}
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-md"
                aria-label="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;