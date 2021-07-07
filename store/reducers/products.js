import Product from '../../models/product';

import {
	CREATE_PRODUCT,
	DELETE_PRODUCT,
	SET_PRODUCTS,
	UPDATE_PRODUCT,
} from '../actions/products';

const initialState = {
	avaliableProducts: [],
	userProducts: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_PRODUCTS:
			return {
				...state,
				avaliableProducts: action.products,
				userProducts: action.userProducts,
			};
		case CREATE_PRODUCT:
			const newProduct = new Product(
				action.productData.id,
				action.productData.ownerId,
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				action.productData.price
			);
			return {
				...state,
				avaliableProducts: state.avaliableProducts.concat(newProduct),
				userProducts: state.userProducts.concat(newProduct),
			};

		case UPDATE_PRODUCT:
			const productIndex = state.userProducts.findIndex(
				(product) => product.id === action.prodId
			);

			const updatedProduct = new Product(
				action.prodId,
				state.userProducts[productIndex].ownerId,
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				state.userProducts[productIndex].price
			);

			const updatedUserProducts = [...state.userProducts];
			updatedUserProducts[productIndex] = updatedProduct;

			const availableProductIndex = state.avaliableProducts.findIndex(
				(product) => product.id === action.prodId
			);

			const updatedAvailableProducts = [...state.avaliableProducts];
			updatedAvailableProducts[availableProductIndex] = updatedProduct;

			return {
				...state,
				avaliableProducts: updatedAvailableProducts,
				userProducts: updatedUserProducts,
			};

		case DELETE_PRODUCT:
			return {
				...state,
				userProducts: state.userProducts.filter(
					(product) => product.id !== action.prodId
				),
				avaliableProducts: state.avaliableProducts.filter(
					(product) => product.id !== action.prodId
				),
			};
		default:
			return state;
	}
};
