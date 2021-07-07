import React, { useCallback, useReducer, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	KeyboardAvoidingView,
	ScrollView,
	Button,
	ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/colors';
import * as authActions from '../../store/actions/auth';

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

export default function AuthScreen(props) {
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [isLogin, setIsLogin] = useState(true);

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: '',
			password: '',
		},
		inputValidities: {
			email: false,
			password: false,
		},
		formIsValid: false,
	});

	const authHandler = async () => {
		let action;
		if (!isLogin) {
			action = authActions.signUp(
				formState.inputValues.email,
				formState.inputValues.password
			);
		} else {
			action = authActions.logIn(
				formState.inputValues.email,
				formState.inputValues.password
			);
		}
		setError(null);
		setIsLoading(true);
		try {
			await dispatch(action);
			props.navigation.navigate('Shop');
		} catch (error) {
			setError(error.message);
			setIsLoading(false);
		}
	};

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	return (
		<KeyboardAvoidingView
			behavior='padding'
			keyboardVerticalOffset={50}
			style={styles.screen}>
			<LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
				<Card style={styles.authContainer}>
					<ScrollView>
						<Input
							id='email'
							label='E-Mail'
							keyboardType='default'
							required
							email
							autoCapitalize='none'
							errorText='Please enter a valid e-mail adress!'
							onInputChange={inputChangeHandler}
							initialValue=''
						/>
						<Input
							id='password'
							label='Password'
							keyboardType='default'
							secureTextEntry
							required
							minLength={6}
							autoCapitalize='none'
							errorText='Please enter a valid password!'
							onInputChange={inputChangeHandler}
							initialValue=''
						/>
						{error && (
							<View style={{ marginTop: 5 }}>
								<Text style={styles.errorMessage}>{error}</Text>
							</View>
						)}
						{isLoading ? (
							<View style={styles.buttonContainer}>
								<ActivityIndicator size='large' color={Colors.primary} />
							</View>
						) : (
							<View style={styles.buttonContainer}>
								<Button
									title={isLogin ? 'Login' : 'Sign Up'}
									color={Colors.primary}
									onPress={authHandler}
								/>
							</View>
						)}
						<View style={styles.buttonContainer}>
							<Button
								title={isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
								color={Colors.accent}
								onPress={() => {
									setIsLogin((prevState) => !prevState);
								}}
							/>
						</View>
					</ScrollView>
				</Card>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
}

AuthScreen.navigationOptions = {
	headerTitle: 'Authentication',
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	authContainer: {
		width: '90%',
		maxWidth: 400,
		maxHeight: 400,
		padding: 20,
	},
	gradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonContainer: {
		marginTop: 10,
	},
	errorMessage: {
		color: 'red',
		fontSize: 14,
	},
});
