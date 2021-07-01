import React from 'react';
import { StyleSheet, FlatList, View, Button, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as ordersAction from '../../store/actions/orders';
import * as cartAction from '../../store/actions/cart';
import Colors from '../../constants/colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';

export default function CartScreen(props) {
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

	return (
		<View style={styles.screen}>
			<Card style={styles.summary}>
				<Text style={styles.summaryText}>
					Total :{' '}
					<Text style={styles.amount}>
						${Math.round(cardTotalAmount.toFixed(2) * 100) / 100}
					</Text>
				</Text>
				<Button
					color={Colors.accent}
					title='Order Now'
					disabled={cartItems.length === 0}
					onPress={() => {
						dispatch(ordersAction.addOrder(cartItems, cardTotalAmount));
					}}
				/>
			</Card>
			{cartItems.length > 0 ? (
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
			) : (
				<View style={styles.emptyCartContainer}>
					<Text style={styles.emptyCartText}>
						Nothing Here. {'\n'}Start shopping
					</Text>
					<Button
						title='Back to Shop'
						onPress={() => props.navigation.goBack()}
					/>
				</View>
			)}
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
	emptyCartContainer: {
		justifyContent: 'center',
		height: '85%',
	},
	emptyCartText: {
		fontSize: 30,
		fontFamily: 'open-sans-bold',
		textAlign: 'center',
		color: '#ccc',
	},
});
