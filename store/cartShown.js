import {createSlice} from '@reduxjs/toolkit'

const initialState={
    cartIsShown:false
}
const CartShown=createSlice({
name:'cartShown',
initialState,
reducers:{
toggle(state){
state.cartIsShown=!state.cartIsShown
}
}
})
export const cartShownActions=CartShown.actions
export default CartShown.reducer