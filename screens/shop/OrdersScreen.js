import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import EmptyPage from '../../components/UI/EmptyPage';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/colors';

export default function OrdersScreen(props) {
	const [isLoading, setIsLoading] = useState(false);

	const orders = useSelector((state) => state.orders.orders);

	const dispatch = useDispatch();

	useEffect(() => {
		setIsLoading(true);
		dispatch(ordersActions.fetchOrders()).then(() => setIsLoading(false));
	}, [dispatch]);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.primary} />
			</View>
		);
	}

	if (!isLoading && orders.length === 0) {
		return (
			<EmptyPage
				iconName='ios-file-tray'
				buttonTitle='Back to Shop'
				text={`Nothing here...${'\n'}Lets order something!`}
				onPressHandler={() => props.navigation.navigate('Products')}
			/>
		);
	}

	return (
		<FlatList
			data={orders}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<OrderItem
					amount={itemData.item.totalAmount}
					date={itemData.item.readableDate}
					items={itemData.item.items}
				/>
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

OrdersScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Your Orders',
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
