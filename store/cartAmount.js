import { createSlice } from "@reduxjs/toolkit";

const initialState={
    Amount:0
}

const cartAmount=createSlice({
name:'CartAmount',
initialState,
reducers:{
decrement(state){
state.Amount++
}
}
})
export const amountActions=cartAmount.actions;
export default cartAmount.reducer;