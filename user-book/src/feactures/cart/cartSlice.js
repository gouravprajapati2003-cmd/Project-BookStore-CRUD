import { createSlice } from '@reduxjs/toolkit'

const getPrice = product => Number(product.originalPrice ?? product.price ?? 0)

const initialState = {
  products: [],
  totalCost: 0,
  message: ''
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = action.payload
      const exists = state.products.some(item => item._id === newProduct._id)

      if (exists) {
        state.message = 'Item already added to cart'
        return
      }

      state.products.push(newProduct)
      state.totalCost += getPrice(newProduct)
      state.message = 'Item added to cart successfully'
    },

    deleteProduct: (state, action) => {
      const product = state.products.find(item => item._id === action.payload)

      if (product) {
        state.totalCost -= getPrice(product)
        state.products = state.products.filter(
          item => item._id !== action.payload
        )
      }

      state.message = 'Item removed from cart'
    },

    deleteCart: state => {
      state.products = []
      state.totalCost = 0
      state.message = ''
    },

    clearCartMessage: state => {
      state.message = ''
    }
  }
})

export const { addProduct, deleteProduct, deleteCart, clearCartMessage } =
  cartSlice.actions

export default cartSlice.reducer
