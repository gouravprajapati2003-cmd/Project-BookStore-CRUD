// import { configureStore } from "@reduxjs/toolkit";
// import cardReducer from '../feactures/cart/cartSlice'
// const store = configureStore({
//     reducer: {
//         cart: cardReducer
//     }
// })
// export default store



import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../feactures/cart/cartSlice'

// Load cart from localStorage
const savedCart = localStorage.getItem('cart')

let preloadedState

try {
  if (savedCart) {
    preloadedState = {
      cart: JSON.parse(savedCart)
    }
  }
} catch (error) {
  console.error('Unable to restore cart:', error)
}

const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState
})

// Save cart whenever Redux state changes
store.subscribe(() => {
  try {
    localStorage.setItem('cart', JSON.stringify(store.getState().cart))
  } catch (error) {
    console.error('Unable to save cart:', error)
  }
})

export default store
