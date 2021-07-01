import PRODUCTS from '../../data/dummy-data';

const initialState = {
	avaliableProducts: PRODUCTS,
	userProducts: PRODUCTS.filter((product) => product.ownerId === 'u1'),
};

export default (state = initialState, action) => {
	switch (action.type) {
		default:
			return state;
	}
};
