import { Alert } from "react-native";
import Toast from 'react-native-toast-message';
import { Font, StatusbarHeight, windowHeight } from './Utils/Utils';
import { LangProvider } from "./Utils/Utils";
class messageFunctionsProviders {
	showError = (message) => {
		Toast.show({
			type: 'error',
			text1: 'Alert!',
			text2: message,
			position: 'top',
			topOffset	:StatusbarHeight + windowHeight/25

		});

	}

	showSuccess = (message, duration = 4000) => {
		Toast.show({
			type: 'success',
			text1: 'Congratulations!',
			text2: message,
			position: 'top',
			topOffset	:StatusbarHeight + windowHeight/25
		});
	}



	alert(title, message, callback) {
		if (callback === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: LangProvider.ok[0],
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: LangProvider.ok[0],
						onPress: () => callback,
					},
				],
				{ cancelable: false },
			);
		}

	}

	confirm(title, message, callbackOk, callbackCancel) {
		if (callbackCancel === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: LangProvider.cancel[0],
					},
					{
						text: LangProvider.ok[0],
						onPress: () => this.btnPageLoginCall(),
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: LangProvider.cancel[0],
						onPress: () => callbackCancel,
					},
					{
						text: LangProvider.ok[0],
						onPress: () => callbackOk,
					},
				],
				{ cancelable: false },
			);
		}

	}

	later(title, message, callbackOk, callbackCancel, callbackLater) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Ask me later',
					onPress: () => LangProvider.later[0],
				},
				{
					text: 'Cancel',
					onPress: () => LangProvider.cancel[0],
				},
				{
					text: 'OK',
					onPress: () => LangProvider.ok[0],
				},
			],
			{ cancelable: false },
		);
	}


}



export const msgProvider = new messageFunctionsProviders();
//--------------------------- Message Provider End -----------------------