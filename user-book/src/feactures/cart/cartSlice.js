import { createSlice } from '@reduxjs/toolkit'
const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    products: [],
    totalCost: 0,
    message: ''
  },

  reducers: {
    // Add Product
    addProduct: (state, action) => {
      const product = state.products.find(
        item => item._id === action.payload._id
      )

      if (product) {
        state.message = 'Item already added to cart'
      } else {
        state.products.push(action.payload)
        state.totalCost = state.totalCost + parseInt(action.payload.originalPrice)
        state.message = 'Item added to cart successfully'
      }
    },

    // Delete Product
    deleteProduct: (state, action) => {
      let product = state.products.find(product => product._id === action.payload)
      state.totalCost = state.totalCost - product.originalPrice;
      state.products = state.products.filter(
        product => product._id !== action.payload
      )
      state.message = 'Item Remove From Cart'
    },
    deleteCart: (state) => {
          state.products.length = 0
          state.totalCost = 0
    },

    // Clear Cart Message
    clearCartMessage: state => {
      state.message = ''
    },

  }
})

export const {
  addProduct,
  deleteProduct,
  clearCartMessage,
  deleteCart,
} = cartSlice.actions

export default cartSlice.reducer

