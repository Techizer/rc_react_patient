import { Alert } from "react-native";
import Toast from 'react-native-simple-toast';
import { showMessage } from "react-native-flash-message";
import { Font } from '../utilslib/Utils';
//--------------------------- Message Provider Start -----------------------
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
				fontSize: Font.cart2heading 
			},
			textStyle: {
				fontFamily: Font.Regular,
				fontSize: Font.allergies_txt_size_edit
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
				fontSize: Font.buttontext_size
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
						text: msgTitle.ok[0],
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
						text: msgTitle.ok[0],
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
						text: msgTitle.cancel[0],
					},
					{
						text: msgTitle.ok[0],
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
						text: msgTitle.cancel[0],
						onPress: () => callbackCancel,
					},
					{
						text: msgTitle.ok[0],
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
					onPress: () => msgTitle.later[0],
				},
				{
					text: 'Cancel',
					onPress: () => msgTitle.cancel[0],
				},
				{
					text: 'OK',
					onPress: () => msgTitle.ok[0],
				},
			],
			{ cancelable: false },
		);
	}


}

//--------------------------- Title Provider Start -----------------------

class messageTitleProvider {
	//----------------- message buttons

	ok = ['Ok', 'Okay', 'Está bem'];
	cancel = ['Cancel', 'Cancelar', 'Cancelar'];
	later = ['Later', 'Más tarde', 'Mais tarde'];
	clearapp = ['Clear notification']
	dltapp = ['Delete notification']
	clear = ['Are your sure you want to clear all notifications?'];
	dltnot = ['Are your sure you want to delete notification?'];
	not_msg = ['Notifications cleared successfully']
	yes = ['Yes']
	no = ['No']
	usererr = ["User id does not exist", ""]
	psdsent = ['Reset link has been sent to your email']

	//--------------- message title 
	information = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	alert = ['Alert', 'Alerta', 'Alerta'];
	confirm = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	validation = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	success = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	error = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	response = ['Response', 'Respuesta', 'Resposta'];
	server = ['Connection Error', 'Error de conexión', 'Erro de conexão'];
	internet = ['Connection Error', 'Error de conexión', 'Erro de conexão']
	deactivate_msg = ['Account deactived']
	deactivate = [0,]
	usernotexit = ["User id does not exist"]
	account_deactivate_title = ['your account deactivated please try again']


	ok = ['Ok', 'Okay', 'Está bem'];
	cancel = ['Cancel', 'Cancelar', 'Cancelar'];
	later = ['Later', 'Más tarde', 'Mais tarde'];
	no = ['No',];
	yes = ['Yes',];
	and = ['and',];

	//--------------- message title 
	information = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	alert = ['Alert', 'Alerta', 'Alerta'];
	confirm = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	validation = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	success = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	error = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	response = ['Response', 'Respuesta', 'Resposta'];
	server = ['Connection Error', 'Error de conexión', 'Erro de conexão'];
	internet = ['Connection Error', 'Error de conexión', 'Erro de conexão']
	deactivate_msg = ['Account deactived']
	deactivate = [0,]
	usernotexit = ["User id does not exist"]
	account_deactivate_title = ['your account deactivated please try again']
	emlsent = ['Email sent successfully']
	psdsent = ['Password has been sent to your email address']

	congrats = ['Congratulations!!']
	changepassword = ['Password changed successfully.']
	contactus = ['Contact us resquest  successfully',]
	delete = ['Delete',]

	reportpopup_user = ['Are you sure? you want to report this user'];
	report_user = ['Report user']
}

//--------------------------- Message Provider Start -----------------------

class messageTextProvider {
	emptyAllfield=['Please enter the above fields.(All fields are mandatory)']

	passwordMinLength = ['Password cannot be less then 6 characters'];
	emptyPassword=['Please enter password','الرجاء إدخال كلمة المرور']
	
	//-------------------------contact us ---------------
	
	emptyMessage=['Please enter message']
	//----------------------change password---------------
	
	
	newmatchPassword = [' New Password or confirm password field must be equal.' ];
	diffrentPassword = ['Current Password or New password should be diffrent.' ];
	emptyOtpMsg=['Please enter the OTP','الرجاء إدخال كلمة المرور لمرة واحدة']

	//======================new msg=================
	emptyName=['Please enter your name!','الرجاء إدخال  الاسم  ']
	emptyEmail=['Email can not be empty','لا يمكن أن يكون البريد الإلكتروني فارغًا  ']
	validEmail=['Please enter valid email id','الرجاء إدخال معرف بريد إلكتروني صالح  ']
	emptymobileNumber = ['Please enter mobile number!','الرجاء إدخال رقم الهاتف المحمول  '];
	validmobileNumber = ['Invalid mobile number!','<string name="رقم الهاتف المحمول غير صالح'];
	emptyid=['Please provide ID Number!','الرجاء ادخال رقم الهوية ' ];
	validataionnewpass=['Please enter Password',' الرجاء إدخال كلمة المرور '];
	emptyPasswordValid = ['Must be at least 8 characters.','  .يجب أن لا تقل عن 8 أحرف أو أرقام   ' ];
	emptyIdValid = ['Must be between 10 to 15 characters or digits','رقم الهوية؟  - "يجب أن يكون بين 10 إلى 15 رقماً أو حرفًا '];
	emptyconfirmPassword=['Please enter confirm password!',' الرجاء إدخال تأكيد كلمة المرور  '];
	Password_notmatch=['Both passwords must match','يجب أن تتطابق كلمتا المرور'];
	emptyEmailmobile=['Email/Password can not be empty.','لا يمكن ترك البريد الإلكتروني / كلمة المرور فارغين  ']
	validIDnumber=['ID Number must be start from 1 or 2 ','يجب أن يبدأ رقم الهوية من 1 أو 2  '];
	emptyCountrycode=['Please enter country code','الرجاء إدخال رمز الدولة']
	//--------------------------life tyle------------------------------
	smoking_msg=['Please enter your smoking habits','Please enter your smoking habits']
	alcohal_msg=['Please enter your alcohol habits','Please enter your alcohol habits']
	bloodgrp_msg=['Please enter your blood group','Please enter your blood group']
	activity_level=['Please enter your activity level','Please enter your activity level']
	food_preferance=['Please enter your food preference','Please enter your food preference']
	occuation=['Please enter your occupation','Please enter your occupation']
	emptySelecttopic=['Please select a topic','الرجاء تحديد موضوع ']
	emptyPasswordblank=['Password can not be blank','Password can not be blank']
	

	emptyPaitentName=['Please enter patient first name','Please enter patient first name']
	emptyPaitentLastName=['Please enter patient last name','Please enter patient last name']
	emptyAge=['Please enter patient age','Please enter patient age']
	EmptyTask=['Please select task',' الرجاء تحديد المهمة  ']
	EmptyTime=['Please select time',' الرجاء تحديد الوقت   ']
    emptyImage=['Please Provide Image','Please Provide Image']
	NoInternet=['Please check your network connection','يرجى التحقق من اتصالك بالشبكة ']
	//==========================success message===================
	sucess_message_login=['Login Successfully','تم تسجيل الدخول بنجاح']
	emptyComingsoon=['Coming Soon','Coming Soon']
	PaymentIntention=['Payment Initiation' , ' بدء الدفع ']
	validIDnumberUAE=['Id number must start with 7','يجب أن يبدأ رقم الهوية بالرقم 7']
}

export const msgText = new messageTextProvider();
export const msgTitle = new messageTitleProvider();
export const msgProvider = new messageFunctionsProviders();
//--------------------------- Message Provider End -----------------------