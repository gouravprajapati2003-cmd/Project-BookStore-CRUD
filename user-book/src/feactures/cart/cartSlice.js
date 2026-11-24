import { createSlice } from '@reduxjs/toolkit'

// Get currently active and valid discount
const getActiveDiscount = product => {
  const discounts = Array.isArray(product?.DiscountDetail)
    ? product.DiscountDetail
    : product?.DiscountDetail
    ? [product.DiscountDetail]
    : []

  const now = new Date()

  return (
    discounts.find(discount => {
      const isActive = discount.status?.toLowerCase() === 'active'

      const validFrom =
        !discount.validFrom || now >= new Date(discount.validFrom)

      const validTo = !discount.validTo || now <= new Date(discount.validTo)

      return isActive && validFrom && validTo
    }) || null
  )
}

// Calculate discounted book price
const getPrice = product => {
  const originalPrice = Number(product.originalPrice ?? product.price ?? 0)

  const discount = getActiveDiscount(product)

  if (!discount) return originalPrice

  const discountValue = Number(discount.discountValue || 0)

  if (discount.discountType === 'Percentage') {
    return Math.max(0, originalPrice - (originalPrice * discountValue) / 100)
  }

  if (discount.discountType === 'Fixed') {
    return Math.max(0, originalPrice - discountValue)
  }

  return originalPrice
}

// Calculate cart total
const calculateTotal = products => {
  return products.reduce((total, product) => {
    return total + getPrice(product) * Number(product.quantity || 1)
  }, 0)
}

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

      const exists = state.products.find(item => item._id === newProduct._id)

      if (exists) {
        const updatedQuantity =
          Number(exists.quantity || 1) + Number(newProduct.quantity || 1)

        // Update latest book and discount details
        Object.assign(exists, newProduct)

        exists.quantity = updatedQuantity

        state.message = 'Item quantity updated successfully'
      } else {
        state.products.push({
          ...newProduct,
          quantity: Math.max(1, Number(newProduct.quantity || 1))
        })

        state.message = 'Item added to cart successfully'
      }

      state.totalCost = calculateTotal(state.products)
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload

      const product = state.products.find(item => item._id === id)

      if (product) {
        product.quantity = Math.max(1, Number(quantity || 1))

        state.totalCost = calculateTotal(state.products)

        state.message = 'Item quantity updated successfully'
      }
    },

    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        item => item._id !== action.payload
      )

      state.totalCost = calculateTotal(state.products)

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

export const {
  addProduct,
  updateQuantity,
  deleteProduct,
  deleteCart,
  clearCartMessage
} = cartSlice.actions

export default cartSlice.reducer
