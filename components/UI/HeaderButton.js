import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Platform } from 'react-native';

export default function CustomHeaderButton(props) {
	return (
		<HeaderButton
			{...props}
			IconComponent={Ionicons}
			iconSize={24}
			color={Platform.OS === 'android' ? '#fff' : Colors.primary}
		/>
	);
}
