import React, { Component } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import {
  Colors,
  mediaprovider,
  msgProvider,
  msgText,
  config,
} from "../utilslib/Utils";
import AppLoader from "./AppLoader";
import NetInfo from "@react-native-community/netinfo";

const AppContext = React.createContext({});
export const AppConsumer = AppContext.Consumer;

export class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isConnected: false,
      backonline: false,
    };
  }
  componentDidMount() {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("check screnns", screens);

      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      this.setState({ isConnected: state.isConnected });
      if (state.isConnected == false) {
        this.checkconnection();
      }
    });
  }
  showProgress = () => this.setState({ loading: true });
  hideProgress = () => this.setState({ loading: false });

  checkconnection = () => {
    const mytimer = setInterval(() => {
      this.checkconnection2(mytimer);
    }, 800);
  };
  checkconnection2 = (mytimer) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected == true) {
        clearInterval(mytimer);
        this.setState({ backonline: true });
      }
    });
  };

  selectcamerimage = async () => {
    await mediaprovider
      .launchCamera()
      .then((res) => {
        this.setState({ mediaopen: false });
        return (Mediaresult = res);
      })
      .catch((error) => {
        Mediaresult = error;
      });
  };
  render() {
    const { loading } = this.state;
    console.log("check screnns", screens);
    const funcs = {
      showLoader: this.showProgress,
      hideLoader: this.hideProgress,
    };

    return (
      <AppContext.Provider value={{ ...funcs }}>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          {/* <SafeAreaView
            style={{ flex: 0, backgroundColor: Colors.statusbarcolor }}
          />
          <StatusBar
            hidden={false}
            StatusBarStyle="light-content"
            backgroundColor={Colors.statusbarcolor}
            translucent={false}
            networkActivityIndicatorVisible={true}
          /> */}

          {this.props.children}

          <AppLoader loading={loading} />
          {screens != "Splash" && (
            <View>
              {!this.state.isConnected && (
                <View
                  style={{ position: "absolute", bottom: 5, width: "100%" }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      paddingVertical: 5,
                      fontSize: 14,
                      color: Colors.White,
                    }}
                    onPress={msgProvider.showError(
                      msgText.NoInternet[config.language]
                    )}
                  />
                </View>
              )}
            </View>
          )}
        </View>
        {/* </SafeAreaView> */}
      </AppContext.Provider>
    );
  }
}
