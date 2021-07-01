import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Button,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform,
} from 'react-native';

import Colors from '../../constants/colors';

export default function ProductItem(props) {
	let TouchableComponent =
		Platform.OS === 'android' && Platform.Version >= 21
			? TouchableNativeFeedback
			: TouchableOpacity;

	return (
		<View style={styles.product}>
			<View style={styles.touchable}>
				<TouchableComponent onPress={props.onViewDetail} useForeground>
					<View>
						<View style={styles.imageContainer}>
							<Image source={{ uri: props.image }} style={styles.image} />
						</View>
						<View style={styles.details}>
							<Text style={styles.title}>{props.title}</Text>
							<Text style={styles.price}>${props.price.toFixed(2)}</Text>
						</View>
						<View style={styles.actions}>
							<Button
								title='Details'
								color={Colors.primary}
								onPress={props.onViewDetail}
							/>
							<Button
								title='To Cart'
								color={Colors.primary}
								onPress={props.onAddToCart}
							/>
						</View>
					</View>
				</TouchableComponent>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	product: {
		shadowColor: '#000',
		shadowOpacity: 0.26,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 10,
		backgroundColor: '#fff',
		height: 300,
		margin: 20,
	},
	touchable: {
		overflow: 'hidden',
		borderRadius: 10,
	},
	details: {
		alignItems: 'center',
		height: '15%',
		padding: 10,
	},
	imageContainer: {
		width: '100%',
		height: '60%',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	title: {
		fontSize: 18,
		paddingBottom: 20,
		fontFamily: 'open-sans-bold',
		marginVertical: 3,
	},
	price: {
		fontSize: 16,
		color: '#888',
		fontFamily: 'open-sans-bold',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '25%',
		paddingHorizontal: 20,
		overflow: 'visible',
	},
});
