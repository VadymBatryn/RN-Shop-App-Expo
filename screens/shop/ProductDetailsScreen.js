import React from 'react';
import {StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native'; //prettier-ignore
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../../constants/colors';
import * as cartActions from '../../store/actions/cart';

export default function ProductDetailsScreen(props) {
	const dispatch = useDispatch();

	const productId = props.navigation.getParam('productId');

	const selectedProduct = useSelector((state) =>
		state.products.avaliableProducts.find((product) => product.id === productId)
	);

	return (
		<ScrollView>
			<Image style={styles.image} source={{ uri: selectedProduct.image }} />
			<View style={styles.actions}>
				<Button
					color={Colors.primary}
					title='Add To Cart'
					onPress={() => {
						dispatch(cartActions.addToCart(selectedProduct));
					}}
				/>
			</View>
			<Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
			<Text style={styles.description}>{selectedProduct.description}</Text>
		</ScrollView>
	);
}

ProductDetailsScreen.navigationOptions = (navData) => {
	return {
		headerTitle: navData.navigation.getParam('productTitle'),
	};
};
const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: 300,
	},
	actions: {
		marginVertical: 10,
		alignItems: 'center',
	},
	price: {
		fontSize: 20,
		color: '#888',
		textAlign: 'center',
		marginVertical: 20,
		fontFamily: 'open-sans-bold',
	},
	description: {
		fontSize: 14,
		textAlign: 'center',
		marginHorizontal: 20,
		fontFamily: 'open-sans',
	},
});
