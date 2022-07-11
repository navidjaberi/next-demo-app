import { combineReducers, configureStore } from "@reduxjs/toolkit";
import CartShown from "./cartShown";
import {createWrapper} from 'next-redux-wrapper'
import cartItems from "./cartItems";


const combain=combineReducers({
    CartShown,
    cartItems,
    
})
export const makeStore =()=> configureStore({
    reducer : combain
});
export const wrapper= createWrapper(makeStore)
