import React from "react";
import { createStackNavigator,CardStyleInterpolators } from "@react-navigation/stack";

import Splash from "../../screens/Splash";
import Login from "../../screens/Login";
import Signup from "../../screens/Signup";
import OTPPage from "../../screens/OTPPage";
import TermsAndConditions from "../../screens/TermsAndConditions";
import ForgotPage from "../../screens/ForgotPage";
import ForgotOTP from "../../screens/ForgotOTP";

const Stack = createStackNavigator();

const AuthStack = (navigation) => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,


    }} initialRouteName={'Login'}>

      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
      />
      <Stack.Screen
        name="ForgotPage"
        component={ForgotPage}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
      />

      <Stack.Screen
        name="Splash"
        component={Splash}
      />

      <Stack.Screen
        name="OTPPage"
        component={OTPPage}
      />
      <Stack.Screen
        name="ForgotOTP"
        component={ForgotOTP}
      />


    </Stack.Navigator>
  );
};
export default AuthStack;
