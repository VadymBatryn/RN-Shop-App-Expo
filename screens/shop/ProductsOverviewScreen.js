import React from 'react';
import { StyleSheet, FlatList, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import CustomHeaderButton from '../../components/UI/HeaderButton';
export default function ProductsOverviewScreen(props) {
	const products = useSelector((state) => state.products.avaliableProducts);

	const dispatch = useDispatch();

	return (
		<FlatList
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.image}
					title={itemData.item.title}
					price={itemData.item.price}
					onViewDetail={() =>
						props.navigation.navigate('ProductDetail', {
							productId: itemData.item.id,
							productTitle: itemData.item.title,
						})
					}
					onAddToCart={() => {
						dispatch(cartActions.addToCart(itemData.item));
					}}
				/>
			)}
		/>
	);
}

ProductsOverviewScreen.navigationOptions = {
	headerTitle: 'All Products',
	headerRight: () => (
		<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
			<Item
				iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
				title='Cart'
				onPress={() => {}}
			/>
		</HeaderButtons>
	),
};

const styles = StyleSheet.create({});
