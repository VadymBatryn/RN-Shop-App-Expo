import React, { useState, useEffect, useCallback } from 'react';
import {
	FlatList,
	Platform,
	Button,
	Alert,
	View,
	ActivityIndicator,
	StyleSheet,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/colors';
import * as ProductsActions from '../../store/actions/products';
import EmptyPage from '../../components/UI/EmptyPage';

export default function UserProductsScreen(props) {
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const userProducts = useSelector((state) => state.products.userProducts);

	const dispatch = useDispatch();

	const editProductHandler = (id) =>
		props.navigation.navigate('EditProduct', { productId: id });

	const deleteHandler = useCallback(
		(productId) => {
			setErrorMessage(null);
			Alert.alert(
				'Are you sure?',
				'Do you really wanna delete this product? ',
				[
					{
						text: 'No',
						style: 'default',
					},
					{
						text: 'Yes',
						style: 'destructive',
						onPress: async () => {
							setIsLoading(true);
							await dispatch(ProductsActions.deleteProduct(productId))
								.catch((error) => {
									setErrorMessage(error.message);
								})
								.finally(() => setIsLoading(false));
						},
					},
				]
			);
		},
		[dispatch, userProducts]
	);

	useEffect(() => {
		if (errorMessage) {
			Alert.alert('An error occured!', errorMessage, [{ text: 'Okay' }]);
		}
	}, [errorMessage]);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && userProducts.length === 0) {
		return (
			<EmptyPage
				iconName='ios-add-circle'
				buttonTitle='Add Product'
				text={`Nothing here...${'\n'}Lets add something!`}
				onPressHandler={() => props.navigation.navigate('EditProduct')}
			/>
		);
	}

	return (
		<FlatList
			data={userProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.image}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={editProductHandler.bind(this, itemData.item.id)}>
					<Button
						title='Edit'
						color={Colors.primary}
						onPress={editProductHandler.bind(this, itemData.item.id)}
					/>
					<Button
						title='Delete'
						color={Colors.primary}
						onPress={deleteHandler.bind(this, itemData.item.id)}
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

UserProductsScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'User Products',
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					title='Menu'
					onPress={() => navData.navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
					title='Menu'
					onPress={() => navData.navigation.navigate('EditProduct')}
				/>
			</HeaderButtons>
		),
	};
};
