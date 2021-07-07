import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

const EmptyPage = (props) => {
	return (
		<View style={styles.centered}>
			<Ionicons name={props.iconName} size={100} color='#ccc' />
			<Text style={styles.bigText}>{props.text}</Text>
			<Button
				title={props.buttonTitle}
				onPress={props.onPressHandler}
				color={Colors.primary}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bigText: {
		fontSize: 30,
		fontFamily: 'open-sans-bold',
		textAlign: 'center',
		color: '#ccc',
	},
});

export default EmptyPage;
