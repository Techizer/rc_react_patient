import { DeviceToken, onLogout, UserDetails } from '../Redux/Actions';
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


export {
    getReduxState,
    setUserData,
    setLogout
};
