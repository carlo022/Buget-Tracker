import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions/';

// 1. Fetch Transactions
export const getTransactions = createAsyncThunk('budget/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// 2. Add Transaction
export const addTransaction = createAsyncThunk('budget/add', 
  async (txData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, txData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// 3. Delete Transaction
export const deleteTransaction = createAsyncThunk('budget/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + id, config);
    return response.data; // Should return { id }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// 4. Update Transaction
export const updateTransaction = createAsyncThunk('budget/update', async (txData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Sends the ID in the URL and the data (name/amount) in the body
    const response = await axios.put(`${API_URL}${txData.id}`, txData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const budgetSlice = createSlice({
  name: 'budget',
  initialState: { transactions: [], isLoading: false, isError: false, message: '' },
  reducers: { resetBudget: (state) => { state.isLoading = false; state.isError = false; } },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => { state.isLoading = true; })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t._id !== action.payload.id);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      });
  }
});

export const { resetBudget } = budgetSlice.actions;
export default budgetSlice.reducer;