import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform,
} from 'react-native';
import Card from '../UI/Card';

export default function ProductItem(props) {
	let TouchableComponent =
		Platform.OS === 'android' && Platform.Version >= 21
			? TouchableNativeFeedback
			: TouchableOpacity;

	return (
		<Card style={styles.product}>
			<View style={styles.touchable}>
				<TouchableComponent onPress={props.onSelect} useForeground>
					<View>
						<View style={styles.imageContainer}>
							<Image source={{ uri: props.image }} style={styles.image} />
						</View>
						<View style={styles.details}>
							<Text style={styles.title}>{props.title}</Text>
							<Text style={styles.price}>${props.price.toFixed(2)}</Text>
						</View>
						<View style={styles.actions}>{props.children}</View>
					</View>
				</TouchableComponent>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	product: {
		height: 300,
		margin: 20,
	},
	touchable: {
		overflow: 'hidden',
		borderRadius: 10,
	},
	details: {
		alignItems: 'center',
		height: '17%',
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
		marginVertical: 2,
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
		height: '23%',
		paddingHorizontal: 20,
		overflow: 'visible',
	},
});
