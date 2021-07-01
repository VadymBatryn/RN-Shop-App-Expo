import React from 'react';
import { FlatList, Platform, Button, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/colors';
import * as ProductsActions from '../../store/actions/products';

export default function UserProductsScreen(props) {
	const userProducts = useSelector((state) => state.products.userProducts);

	const dispatch = useDispatch();

	const deleteHandler = (productId) => {
		Alert.alert('Are you sure?', 'Do you really wanna delete this product? ', [
			{
				text: 'No',
				style: 'default',
			},
			{
				text: 'Yes',
				style: 'destructive',
				onPress: () => {
					dispatch(ProductsActions.deleteProduct(productId));
				},
			},
		]);
	};

	const editProductHandler = (id) =>
		props.navigation.navigate('EditProduct', { productId: id });

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
