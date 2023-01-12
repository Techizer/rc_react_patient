import {
    DEVICE_TOKEN,
    DEVICE_ID,
    DEVICE_NAME,
    APP_VERSION,
    APP_LANGUAGE,
    CONTENT_ALIGNMENT,
    DEVICE_CONNECTION,
    USER_ADDRESS,
    DEVICE_TYPE,
    USER_CREDENTIALS,
    REMEMBER_ME,
} from './Types'

const Guest = (payload) => ({
    type: GUEST,
    payload
})

const Restart = (payload) => {
    console.log({ payload });
    return ({
        type: RESTART,
        payload
    })
}

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

const AppVersion = (payload) => ({
    type: APP_VERSION,
    payload
})

const AppLanguage = (payload) => ({
    type: APP_LANGUAGE,
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


export {
    Guest,
    UserDetails,
    UserCredentials,
    DeviceToken,
    DeviceID,
    DeviceName,
    DeviceType,
    AppVersion,
    AppLanguage,
    Address,
    ContentAlign,
    InternetStatus,
    RememberMe,
    Restart
}