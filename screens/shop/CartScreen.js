import React, { useState } from 'react';
import {
	StyleSheet,
	FlatList,
	View,
	Button,
	Text,
	ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as ordersAction from '../../store/actions/orders';
import * as cartAction from '../../store/actions/cart';
import Colors from '../../constants/colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import EmptyPage from '../../components/UI/EmptyPage';

export default function CartScreen(props) {
	const [isLoading, setIsLoading] = useState(false);

	//Just a dispatch
	const dispatch = useDispatch();

	//Amount of product prices
	const cardTotalAmount = useSelector((state) => state.cart.totalAmount);

	//Cart items were added
	const cartItems = useSelector((state) => {
		const transformedCardItems = [];
		for (const key in state.cart.items) {
			transformedCardItems.push({
				productId: key,
				productTitle: state.cart.items[key].productTitle,
				productPrice: state.cart.items[key].productPrice,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum,
			});
		}
		return transformedCardItems.sort((a, b) =>
			a.productId > b.productId ? 1 : -1
		);
	});

	const sendOrderHandler = async () => {
		setIsLoading(true);
		await dispatch(ordersAction.addOrder(cartItems, cardTotalAmount));
		setIsLoading(false);
	};

	if (!isLoading && cartItems.length === 0) {
		return (
			<EmptyPage
				iconName='ios-cart'
				buttonTitle='Back to Shop'
				text={`Nothing Here. ${'\n'}Start shopping`}
				onPressHandler={() => props.navigation.goBack()}
			/>
		);
	}

	return (
		<View style={styles.screen}>
			<Card style={styles.summary}>
				<Text style={styles.summaryText}>
					Total :{' '}
					<Text style={styles.amount}>
						${Math.round(cardTotalAmount.toFixed(2) * 100) / 100}
					</Text>
				</Text>
				{isLoading ? (
					<View style={styles.centered}>
						<ActivityIndicator size='small' color={Colors.primary} />
					</View>
				) : (
					<Button
						color={Colors.accent}
						title='Order Now'
						disabled={cartItems.length === 0}
						onPress={sendOrderHandler}
					/>
				)}
			</Card>
			<FlatList
				style={{
					borderRadius: 10,
					marginHorizontal: 20,
				}}
				data={cartItems}
				keyExtractor={(item) => item.productId}
				renderItem={(itemData) => (
					<CartItem
						quantity={itemData.item.quantity}
						title={itemData.item.productTitle}
						amount={itemData.item.sum}
						deletable={true}
						onRemove={() => {
							dispatch(cartAction.removeFromCart(itemData.item.productId));
						}}
					/>
				)}
			/>
		</View>
	);
}

CartScreen.navigationOptions = {
	headerTitle: 'Your Cart',
};

const styles = StyleSheet.create({
	screen: {
		margin: 20,
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 10,
	},
	summaryText: {
		fontFamily: 'open-sans-bold',
		fontSize: 18,
	},
	amount: {
		color: Colors.primary,
	},
});
