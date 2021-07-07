import React, { useEffect, useState, useCallback } from 'react';
import {
	FlatList,
	Platform,
	Button,
	ActivityIndicator,
	View,
	StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/colors';
import EmptyPage from '../../components/UI/EmptyPage';

export default function ProductsOverviewScreen(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const products = useSelector((state) => state.products.avaliableProducts);

	const dispatch = useDispatch();

	const loadProducts = useCallback(async () => {
		setErrorMessage(null);
		setIsRefreshing(true);
		try {
			await dispatch(productActions.fetchProducts());
		} catch (err) {
			setErrorMessage(err.message);
		}
		setIsRefreshing(false);
	}, [dispatch, setErrorMessage, setIsRefreshing]);

	useEffect(() => {
		const willFocusSub = props.navigation.addListener(
			'willFocus',
			loadProducts
		);

		return () => {
			willFocusSub.remove();
		};
	}, [loadProducts]);

	useEffect(() => {
		setIsLoading(true);
		loadProducts().then(() => setIsLoading(false));
	}, [dispatch, loadProducts]);

	if (errorMessage) {
		return (
			<EmptyPage
				iconName='ios-bug-outline'
				buttonTitle='Try again'
				text={`An error occured!`}
				onPressHandler={() => loadProducts()}
			/>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && products.length === 0) {
		return (
			<EmptyPage
				iconName='ios-shirt'
				buttonTitle='Add Product'
				text={`No product yet...${'\n'}Start adding some!`}
				onPressHandler={() => props.navigation.navigate('EditProduct')}
			/>
		);
	}

	const selectItemHandler = (id, title) => {
		props.navigation.navigate('ProductDetail', {
			productId: id,
			productTitle: title,
		});
	};

	return (
		<FlatList
			onRefresh={loadProducts}
			refreshing={isRefreshing}
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.image}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={selectItemHandler.bind(
						this,
						itemData.item.id,
						itemData.item.title
					)}>
					<Button
						title='View Details'
						color={Colors.primary}
						onPress={selectItemHandler.bind(
							this,
							itemData.item.id,
							itemData.item.title
						)}
					/>
					<Button
						title='To Cart'
						color={Colors.primary}
						onPress={() => dispatch(cartActions.addToCart(itemData.item))}
					/>
				</ProductItem>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

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
