import Types from "../types";

const CartAction = {
  addToCart: (data) => ({
    type: Types.ADD_TO_CART,
    payload: data,
  }),

  removeFromCart: (id) => ({
    type: Types.REMOVE_FROM_CART,
    payload: id,
  }),

  clearCart: () => ({
    type: Types.CLEAR_CART,
  }),
}
export default CartAction;