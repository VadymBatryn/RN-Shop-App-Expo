import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';

import CartItem from '../../models/cartItem';

const initialState = {
	items: {},
	totalAmount: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const addedProduct = action.product;
			const productPrice = addedProduct.price;
			const productTitle = addedProduct.title;
			let updatedOrNewCartItem;

			if (state.items[addedProduct.id]) {
				//already have item in a cart
				updatedOrNewCartItem = new CartItem(
					state.items[addedProduct.id].quantity + 1,
					productPrice,
					productTitle,
					state.items[addedProduct.id].sum + productPrice
				);
			} else {
				updatedOrNewCartItem = new CartItem(
					1,
					productPrice,
					productTitle,
					productPrice
				);
			}
			return {
				...state,
				items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
				totalAmount: state.totalAmount + productPrice,
			};
		case REMOVE_FROM_CART:
			const selectedCartItem = state.items[action.prodId];
			const currentQuantity = state.items[action.prodId].quantity;

			let updatedCartItems = {};

			if (currentQuantity > 1) {
				//reduce not erase
				const updatedCartItem = new CartItem(
					selectedCartItem.quantity - 1,
					selectedCartItem.productPrice,
					selectedCartItem.productTitle,
					selectedCartItem.sum - selectedCartItem.productPrice
				);
				updatedCartItems = {
					...state.items,
					[action.prodId]: updatedCartItem,
				};
			} else {
				updatedCartItems = { ...state.items };
				delete updatedCartItems[action.prodId];
			}
			return {
				...state,
				items: updatedCartItems,
				totalAmount: state.totalAmount - selectedCartItem.productPrice,
			};
		case DELETE_PRODUCT: {
			if (!state.items[action.prodId]) {
				return state;
			}

			const updatedItems = { ...state.items };
			const itemTotal = state.items[action.prodId].sum;
			delete updatedItems[action.prodId];

			return {
				...state,
				items: updatedItems,
				totalAmount: state.totalAmount - itemTotal,
			};
		}

		case ADD_ORDER: {
			return initialState;
		}
		default:
			return state;
	}
};
