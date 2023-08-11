
import { DeviceConnection, DeviceToken, onLogout, setVideoCall, setVideoCallStatus, UserDetails } from '../Redux/Actions';
import { store } from '../Redux/Index'

// Function to get the Redux state
const getReduxState = () => {
    const state = store.getState();
    return state.StorageReducer; // This will return your entire Redux state object
};

const setUserData = (token, userData) => {

    store.dispatch(DeviceToken(token));
    store.dispatch(UserDetails(userData))
};

const setLogout = () => {

    store.dispatch(onLogout());
};

const setConnection = (isConnected) => {
    const { callStatus, isVideoCall } = getReduxState();

    store.dispatch(DeviceConnection(isConnected));
    if (!isConnected && isVideoCall && (callStatus == 7 || callStatus == 2)) {
        setTimeout(() => {
            store.dispatch(setVideoCallStatus(10))
        }, 1000);
    } else if (!isConnected && isVideoCall && (callStatus == 0 || callStatus == 1 || callStatus == 8)) {
        store.dispatch(setVideoCallStatus(0))
        setTimeout(() => {
            store.dispatch(setVideoCall(false))
        }, 2000);
    } else if (!isConnected && isVideoCall && (callStatus == 4 || callStatus == 5 || callStatus == 9)) {
        store.dispatch(setVideoCallStatus(callStatus))
    }
    // else if (isConnected && isVideoCall && (callStatus == 0 || callStatus == 1 || callStatus == 8)) {
    //     store.dispatch(setVideoCallStatus(callStatus))
    // }
};

export {
    getReduxState,
    setUserData,
    setLogout,
    setConnection
};

