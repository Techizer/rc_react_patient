import {
    DEVICE_TOKEN,
    USER_DETAIL,
    DEVICE_ID,
    DEVICE_NAME,
    APP_VERSION,
    APP_LANGUAGE,
    CONTENT_ALIGNMENT,
    DEVICE_CONNECTION,
    USER_ADDRESS,
    DEVICE_TYPE,
    GUEST,
    USER_CREDENTIALS,
    REMEMBER_ME,
    RESTART,
    LOGOUT,
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
    VIDEO_CALL_DATA
} from './Types'

const Guest = (payload) => ({
    type: GUEST,
    payload
})

const onLogout = (payload) => ({
    type: LOGOUT,
    payload
})

const Restart = (payload) => ({
    type: RESTART,
    payload
})

const UserDetails = (payload) => ({
    type: USER_DETAIL,
    payload
})

const UserCredentials = (payload) => ({
    type: USER_CREDENTIALS,
    payload
})

const DeviceToken = (payload) => ({
    type: DEVICE_TOKEN,
    payload
})

const DeviceID = (payload) => ({
    type: DEVICE_ID,
    payload
})

const DeviceName = (payload) => ({
    type: DEVICE_NAME,
    payload
})

const DeviceType = (payload) => ({
    type: DEVICE_TYPE,
    payload
})

const DeviceConnection = (payload) => ({
    type: DEVICE_CONNECTION,
    payload
})

const AppVersion = (payload) => ({
    type: APP_VERSION,
    payload
})

const AppLanguage = (payload) => ({
    type: APP_LANGUAGE,
    payload
})

const IsLanguageUpdated = (payload) => ({
    type: LANGUAGE_UPDATED,
    payload
})

const LanguageIndex = (payload) => ({
    type: LANGUAGE_INDEX,
    payload
})

const ContentAlign = (payload) => ({
    type: CONTENT_ALIGNMENT,
    payload
})

const Address = (payload) => ({
    type: USER_ADDRESS,
    payload
})

const RememberMe = (payload) => ({
    type: REMEMBER_ME,
    payload
})

const InternetStatus = (payload) => ({
    type: DEVICE_CONNECTION,
    payload
})

const UnReadNotifications = (payload) => ({
    type: NOTI_COUNT,
    payload
})

const TodaysAppointments = (payload) => ({
    type: TODAY_APPOINTMENT,
    payload
})

const TodaysConsultations = (payload) => ({
    type: TODAY_CONSULT,
    payload
})

const TodaysLabTests = (payload) => ({
    type: TODAY_LAB,
    payload
})

const SelectedProvider = (payload) => ({
    type: SELECTED_PROVIDER,
    payload
})

const CartTime = (payload) => {

    console.log({ payload });
    return ({
        type: CART,
        payload
    })

}
const CurrentRoute = (payload) => ({
    type: CURRENT_ROUTE,
    payload
})


const TabbyPaymentStatus = (payload) => ({
    type: TABBY_PAYMENT,
    payload
})

const UserProfile = (payload) => ({
    type: USER_PROFILE,
    payload
})

const setAppState = payload => ({
    type: APP_STATE,
    payload
})


const setVideoCall = payload => ({
    type: VIDEO_CALL,
    payload
})

const setVideoCallData = payload => ({
    type: VIDEO_CALL_DATA,
    payload
})

export {
    Guest,
    UserDetails,
    UserCredentials,
    DeviceToken,
    DeviceID,
    DeviceName,
    DeviceType,
    DeviceConnection,
    AppVersion,
    AppLanguage,
    IsLanguageUpdated,
    LanguageIndex,
    Address,
    ContentAlign,
    InternetStatus,
    RememberMe,
    Restart,
    onLogout,
    UnReadNotifications,
    TodaysAppointments,
    TodaysConsultations,
    TodaysLabTests,
    SelectedProvider,
    CartTime,
    TabbyPaymentStatus,
    UserProfile,
    CurrentRoute,
    setAppState,
    setVideoCall,
    setVideoCallData
}