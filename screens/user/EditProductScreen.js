import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, View, Platform, Alert } from 'react-native'; //prettier-ignore
import { useDispatch, useSelector } from 'react-redux';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

export default function EditProductScreen(props) {
	const dispatch = useDispatch();

	const prodId = props.navigation.getParam('productId');

	const editedProduct = useSelector((state) =>
		state.products.userProducts.find((prod) => prod.id === prodId)
	);

	const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
	const [imageUrl, setImageUrl] = useState(
		editedProduct ? editedProduct.image : ''
	);
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState(
		editedProduct ? editedProduct.description : ''
	);

	const submitHandler = useCallback(() => {
		if (editedProduct) {
			dispatch(
				productsActions.updateProduct(prodId, title, imageUrl, description)
			);
		} else
			dispatch(
				productsActions.createProduct(title, imageUrl, +price, description)
			);
		props.navigation.goBack();
	}, [dispatch, prodId, title, price, description, imageUrl]);

	useEffect(() => {
		props.navigation.setParams({ submit: submitHandler });
	}, [submitHandler]);

	return (
		<ScrollView>
			<View style={styles.form}>
				<View style={styles.formControl}>
					<Text style={styles.label}>Title</Text>
					<TextInput
						style={styles.input}
						value={title}
						onChangeText={(text) => {
							setTitle(text);
						}}
					/>
				</View>
				<View style={styles.formControl}>
					<Text style={styles.label}>Image URL</Text>
					<TextInput
						style={styles.input}
						value={imageUrl}
						onChangeText={(text) => setImageUrl(text)}
					/>
				</View>
				{editedProduct ? null : (
					<View style={styles.formControl}>
						<Text style={styles.label}>Price</Text>
						<TextInput
							style={styles.input}
							value={price}
							onChangeText={(text) => setPrice(text)}
						/>
					</View>
				)}
				<View style={styles.formControl}>
					<Text style={styles.label}>Description</Text>
					<TextInput
						style={styles.input}
						value={description}
						onChangeText={(text) => setDescription(text)}
					/>
				</View>
			</View>
		</ScrollView>
	);
}

EditProductScreen.navigationOptions = (navData) => {
	const submitFunction = navData.navigation.getParam('submit');

	return {
		headerTitle: navData.navigation.getParam('productId')
			? 'Edit Product'
			: 'Add Product',
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					iconName={
						Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
					}
					title='Menu'
					onPress={submitFunction}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	form: {
		margin: 20,
	},
	formControl: {
		width: '100%',
	},
	label: {
		fontFamily: 'open-sans-bold',
		marginVertical: 8,
	},
	input: {
		paddingHorizontal: 2,
		paddingVertical: 5,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
});
