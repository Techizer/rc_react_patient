
import {
    HAS_SESSION,
    USER_DETAIL,
    GUEST,
    DEVICE_TOKEN,
    DEVICE_ID,
    DEVICE_NAME,
    APP_VERSION,
    APP_LANGUAGE,
    CONTENT_ALIGNMENT,
    DEVICE_CONNECTION,
    LOGOUT,
    USER_ADDRESS,
    DEVICE_TYPE,
    USER_CREDENTIALS,
    REMEMBER_ME,
    RESTART,
    NOTI_COUNT,
    TODAY_APPOINTMENT,
    TODAY_CONSULT,
    TODAY_LAB,
    SELECTED_PROVIDER,
    LANGUAGE_INDEX,
    CART,
    TABBY_PAYMENT,
    LANGUAGE_UPDATED,
    CURRENT_ROUTE,
    USER_PROFILE,
    APP_STATE,
    VIDEO_CALL,
    VIDEO_CALL_DATA,
    INCOMING_VIDEO_CALL,
    VIDEO_CALL_STATUS,
    NO_INTERNET
} from './Types';

const initialState = {
    appLanguage: 'ar',
    languageIndex: 1,
    authToken: null,
    deviceToken: null,
    deviceId: null,
    deviceName: null,
    deviceType: null,
    deviceConnection: null,
    appVersion: null,
    contentAlign: 'right',
    guest: null,
    loggedInUserDetails: null,
    address: null,
    credentials: null,
    rememberMe: false,
    restart: false,
    notiCount: 0,
    todayAppointments: 0,
    todayConsultations: 0,
    todayLabTests: 0,
    selectedProvider: null,
    cartTime: 0,
    tabbyPayment: false,
    userProfile: null,
    isLanguageUpdated: false,
    currentRoute: '',
    appState: '',
    isIncomingCall: false,
    isVideoCall: false,
    videoDetails: null,
    callStatus: 0,
    noInternet: false
};

export const ReducerCases = (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGOUT:
            return {
                ...initialState,
                appLanguage: state.appLanguage,
                deviceToken: state.deviceToken,
                deviceId: state.deviceId,
                deviceName: state.deviceName,
                deviceType: state.deviceType,
                appVersion: state.appVersion,
                contentAlign: state.contentAlign,
                address: state.address,
                credentials: state.credentials,
                rememberMe: state.rememberMe,
                languageIndex: state.languageIndex,
                isLanguageUpdated: state.isLanguageUpdated,
                deviceConnection: state.deviceConnection,
                loggedInUserDetails: state.loggedInUserDetails,
                selectedProvider: state.selectedProvider
            }
        case CURRENT_ROUTE:
            return {
                ...state,
                currentRoute: action.payload,
            };
        case HAS_SESSION:
            return {
                ...state,
                authToken: action.payload,
            };
        case CART:
            return {
                ...state,
                cartTime: action.payload,
            };
        case NOTI_COUNT:
            return {
                ...state,
                notiCount: action.payload,
            };
        case SELECTED_PROVIDER:
            return {
                ...state,
                selectedProvider: action.payload,
            };
        case TODAY_APPOINTMENT:
            return {
                ...state,
                todayAppointments: action.payload,
            };
        case TODAY_CONSULT:
            return {
                ...state,
                todayConsultations: action.payload,
            };
        case TODAY_LAB:
            return {
                ...state,
                todayLabTests: action.payload,
            };
        case RESTART:
            return {
                ...state,
                restart: action.payload,
            };
        case USER_DETAIL:
            return {
                ...state,
                loggedInUserDetails: action.payload,
            };
        case USER_CREDENTIALS:
            return {
                ...state,
                credentials: action.payload,
            };
        case REMEMBER_ME:
            return {
                ...state,
                rememberMe: action.payload,
            };
        case USER_ADDRESS:
            return {
                ...state,
                address: action.payload,
            };
        case GUEST:
            return {
                ...state,
                guest: action.payload,
            };
        case DEVICE_TOKEN:
            return {
                ...state,
                deviceToken: action.payload,
            };
        case DEVICE_ID:
            return {
                ...state,
                deviceId: action.payload,
            };
        case DEVICE_NAME:
            return {
                ...state,
                deviceName: action.payload,
            };
        case DEVICE_TYPE:
            return {
                ...state,
                deviceType: action.payload,
            };
        case DEVICE_CONNECTION:
            return {
                ...state,
                deviceConnection: action.payload,
            };
        case APP_LANGUAGE:
            return {
                ...state,
                appLanguage: action.payload,
            };
        case LANGUAGE_UPDATED:
            return {
                ...state,
                isLanguageUpdated: action.payload,
            };
        case LANGUAGE_INDEX:
            return {
                ...state,
                languageIndex: action.payload,
            };
        case APP_VERSION:
            return {
                ...state,
                appVersion: action.payload,
            };
        case CONTENT_ALIGNMENT:
            return {
                ...state,
                contentAlign: action.payload,
            };
        case TABBY_PAYMENT:
            return {
                ...state,
                tabbyPayment: action.payload,
            };
        case USER_PROFILE:
            return {
                ...state,
                userProfile: action.payload,
            };
        case APP_STATE:
            return {
                ...state,
                appState: action.payload,
            };

        case INCOMING_VIDEO_CALL:
            return {
                ...state,
                isIncomingCall: action.payload,
            };

        case VIDEO_CALL:
            return {
                ...state,
                isVideoCall: action.payload,
            };
        case VIDEO_CALL_DATA:
            return {
                ...state,
                videoDetails: action.payload,
            };
        case VIDEO_CALL_STATUS:
            return {
                ...state,
                callStatus: action.payload,
            };
        case NO_INTERNET:
            return {
                ...state,
                noInternet: action.payload,
            };
        default:
            return state;
    }
}

