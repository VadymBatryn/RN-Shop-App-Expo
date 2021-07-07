import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (token, userId, expiryTime) => {
	return (dispatch) => {
		dispatch(setLogoutTimer(expiryTime));
		dispatch({ type: AUTHENTICATE, token: token, userId: userId });
	};
};

export const signUp = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBTlrg1GFUap8revl_2fnTITSqnh48FjnE',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);

		if (!response.ok) {
			const errorResponse = await response.json();
			const errorId = errorResponse.error.message;
			let message;
			switch (errorId) {
				case 'EMAIL_EXISTS':
					message = 'This email is already taken!';
					break;
				default:
					message = 'Something went wrong!';
			}

			throw new Error(message);
		}

		const resData = await response.json();

		dispatch(
			authenticate(
				resData.idToken,
				resData.localId,
				parseInt(resData.expiresIn) * 1000
			)
		);
		const expirationDate = new Date(
			new Date().getTime() + parseInt(resData.expiresIn) * 1000
		);
		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
};

export const logIn = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBTlrg1GFUap8revl_2fnTITSqnh48FjnE',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);

		if (!response.ok) {
			const errorResponse = await response.json();
			const errorId = errorResponse.error.message;
			let message;
			switch (errorId) {
				case 'EMAIL_NOT_FOUND':
					message = 'This email is not found, please try again!';
					break;
				case 'INVALID_PASSWORD':
					message = 'Incorrect password, please try again!';
					break;
				case 'USER_DISABLED':
					message = 'This account has been disabled by administration';
					break;
				default:
					message = 'Something went wrong!';
			}

			throw new Error(message);
		}

		const resData = await response.json();

		dispatch(
			authenticate(
				resData.idToken,
				resData.localId,
				parseInt(resData.expiresIn) * 1000
			)
		);
		const expirationDate = new Date(
			new Date().getTime() + parseInt(resData.expiresIn) * 1000
		);
		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
};

export const logout = () => {
	clearLogoutTimer();
	AsyncStorage.removeItem('userData');
	return { type: LOGOUT };
};

const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};

const setLogoutTimer = (expirationTime) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout());
		}, expirationTime);
	};
};

const saveDataToStorage = (token, userId, expirationDate) => {
	AsyncStorage.setItem(
		'userData',
		JSON.stringify({
			token: token,
			userId: userId,
			expiryDate: expirationDate.toISOString(),
		})
	);
};
