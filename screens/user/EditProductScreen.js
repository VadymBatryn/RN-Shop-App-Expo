import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView, View, Platform, Alert, ActivityIndicator } from 'react-native'; //prettier-ignore
import { useDispatch, useSelector } from 'react-redux';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
	if (action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid,
		};

		let updatedFormIsValid = true;

		for (const key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}

		return {
			formIsValid: updatedFormIsValid,
			inputValidities: updatedValidities,
			inputValues: updatedValues,
		};
	}
	return state;
};

export default function EditProductScreen(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const dispatch = useDispatch();

	const prodId = props.navigation.getParam('productId');

	const editedProduct = useSelector((state) =>
		state.products.userProducts.find((prod) => prod.id === prodId)
	);

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			title: editedProduct ? editedProduct.title : '',
			imageUrl: editedProduct ? editedProduct.image : '',
			description: editedProduct ? editedProduct.description : '',
			price: '',
		},
		inputValidities: {
			title: editedProduct ? true : false,
			imageUrl: editedProduct ? true : false,
			description: editedProduct ? true : false,
			price: editedProduct ? true : false,
		},
		formIsValid: editedProduct ? true : false,
	});

	const submitHandler = useCallback(async () => {
		if (!formState.formIsValid) {
			Alert.alert('Wrong input', 'Please check the errors in the form.', [
				{ text: 'Okay' },
			]);
			return;
		}

		setErrorMessage(null);
		setIsLoading(true);

		try {
			if (editedProduct) {
				await dispatch(
					productsActions.updateProduct(
						prodId,
						formState.inputValues.title,
						formState.inputValues.imageUrl,
						formState.inputValues.description
					)
				);
			} else {
				await dispatch(
					productsActions.createProduct(
						formState.inputValues.title,
						formState.inputValues.imageUrl,
						+formState.inputValues.price,
						formState.inputValues.description
					)
				);
			}
		} catch (err) {
			setErrorMessage(err.message);
		}
		props.navigation.goBack();
		setIsLoading(false);
	}, [dispatch, prodId, formState]);

	useEffect(() => {
		if (errorMessage) {
			Alert.alert('An error occured!', errorMessage, [{ text: 'Okay' }]);
		}
	}, [errorMessage]);

	useEffect(() => {
		props.navigation.setParams({ submit: submitHandler });
	}, [submitHandler]);

	const inputChangleHandler = useCallback(
		(inputId, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputId,
			});
		},
		[dispatchFormState]
	);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.primary} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : null}
			keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id='title'
						label='Title'
						errorText='Please enter a valid title!'
						keyboardType='default'
						autoCapitalize='sentences'
						autoCorrect
						returnKeyType='next'
						onInputChange={inputChangleHandler}
						initialValue={editedProduct ? editedProduct.title : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					<Input
						id='imageUrl'
						label='Image URL'
						errorText='Please enter a valid URL!'
						keyboardType='default'
						autoCapitalize='sentences'
						autoCorrect
						returnKeyType='next'
						onInputChange={inputChangleHandler}
						initialValue={editedProduct ? editedProduct.image : ''}
						initiallyValid={!!editedProduct}
						required
					/>
					{editedProduct ? null : (
						<Input
							id='price'
							label='Price'
							errorText='Please enter a valid price!'
							keyboardType='decimal-pad'
							onInputChange={inputChangleHandler}
							required
							min={0.1}
						/>
					)}
					<Input
						id='description'
						label='Description'
						errorText='Please enter a valid description!'
						keyboardType='default'
						autoCapitalize='sentences'
						autoCorrect
						multiline
						numberOfLines={3}
						onInputChange={inputChangleHandler}
						initialValue={editedProduct ? editedProduct.description : ''}
						initiallyValid={!!editedProduct}
						required
						minLength={5}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
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
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	form: {
		margin: 20,
	},
});
