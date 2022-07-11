import { createSlice } from "@reduxjs/toolkit";
const initialState={
    items:[],
    totatAmount:0,
  total:0
}
const cartItems=createSlice({
name:'cartItems',
initialState,
reducers:{
    addItemToCart(state,action){
        const newItem=action.payload;
        const existingItem=state.items.find((item)=>item.id === newItem.id)
        
        state.totatAmount++
        if(!existingItem){
            state.items.push({
                id:newItem.id,
                price:+newItem.price,
                amount: 1,
                totalPrice:newItem.price,
                name:newItem.name,
              
            })
          
                
           }else{
existingItem.amount++;
// state.total=existingItem.totalPrice+newItem.price
existingItem.totalPrice=existingItem.totalPrice+newItem.price
            }
            state.total=newItem.price + state.total
        },
      removeFromCart(state,action){
        const id=action.payload;
     
        const existingItem=state.items.find((item)=>item.id === id.id);
        state.totatAmount--
        if(existingItem.amount === 1){
state.items=state.items.filter(item=>item.id !== id.id)

        }else{
            existingItem.amount--
            existingItem.totalPrice=existingItem.totalPrice-existingItem.price
        }
        state.total=  state.total  - id.price
      }  

    }
})
export const cartItemsActions=cartItems.actions;
export default cartItems.reducer


