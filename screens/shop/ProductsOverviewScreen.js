import React from 'react';
import { FlatList, Platform, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/colors';

export default function ProductsOverviewScreen(props) {
	const products = useSelector((state) => state.products.avaliableProducts);

	const dispatch = useDispatch();

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('ProductDetail', {
			productId: id,
			productTitle: title,
		});
	};

	return (
		<FlatList
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.image}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() =>
						selectItemHandler(itemData.item.id, itemData.item.title)
					}>
					<Button
						title='Details'
						color={Colors.primary}
						onPress={() =>
							selectItemHandler(itemData.item.id, itemData.item.title)
						}
					/>
					<Button
						title='To Cart'
						color={Colors.primary}
						onPress={() => {
							dispatch(cartActions.addToCart(itemData.item));
						}}
					/>
				</ProductItem>
			)}
		/>
	);
}

ProductsOverviewScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'All Products',
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					title='Cart'
					onPress={() => navData.navigation.navigate('Cart')}
				/>
			</HeaderButtons>
		),
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					title='Menu'
					onPress={() => navData.navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
	};
};
