import { Alert } from "react-native";
import Toast from 'react-native-simple-toast';
import { showMessage } from "react-native-flash-message";
import { Font } from './Utils/Utils';
import { LangProvider } from "./Utils/Utils";
class messageFunctionsProviders {
	showError = (message) => {
		showMessage({
			message: message, //"SORRY!",
			description: "",
			type: "danger",
			//color: '#000000',
			backgroundColor: 'red',
			duration: 4000,
			titleStyle: {
				fontFamily: Font.Regular,
				fontSize: Font.xlarge 
			},
			textStyle: {
				fontFamily: Font.Regular,
				fontSize: Font.xlarge
			}
		});
	}

	showSuccess = (message, duration = 4000) => {
		showMessage({
			message: message,
			description: "",
			type: "success",
			//color: '#000000',
			backgroundColor: '#71AC2B', //'#006400', //'#228B22',
			duration: duration,
			titleStyle: {
				fontFamily: Font.Regular,
				fontSize: Font.medium
			}
		});
	}
	toast(message, position) {
		if (position == 'center') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
		}
		else if (position == 'top') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
		}
		else if (position == 'bottom') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);

		}
		else if (position == 'long') {
			Toast.showWithGravity(message, Toast.LONG, Toast.CENTER);
		}

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