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
    LANGUAGE_UPDATED
} from './Types';

const initialState = {
    appLanguage: 'ar',
    languageIndex: 1,
    authToken: null,
    deviceToken: null,
    deviceId: null,
    deviceName: null,
    deviceType: null,
    appVersion: null,
    contentAlign: 'right',
    guest: null,
    loggedInUserDetails: null,
    address: null,
    credentials: null,
    rememberMe: false,
    restart: false,
    notiCount: 0,
    todayAppointments: null,
    todayConsultations: null,
    todayLabTests: null,
    selectedProvider: null,
    cart: -1,
    tabbyPayment: false,
    isLanguageUpdated:false
};

export const ReducerCases = (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGOUT:
            return {
                ...initialState,
                appLanguage: action.payload.appLanguage,
                deviceToken: action.payload.deviceToken,
                deviceId: action.payload.deviceId,
                deviceName: action.payload.deviceName,
                deviceType: action.payload.deviceType,
                appVersion: action.payload.appVersion,
                contentAlign: action.payload.contentAlign,
                address: action.payload.address,
                credentials: action.payload.credentials,
                rememberMe: action.payload.rememberMe,
                languageIndex: action.payload.languageIndex,
                isLanguageUpdated:action.payload.isLanguageUpdated
            }

        case HAS_SESSION:
            return {
                ...state,
                authToken: action.payload,
            };
        case CART:
            return {
                ...state,
                cart: action.payload,
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
                isInternet: action.payload,
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
        default:
            return state;
    }
}
