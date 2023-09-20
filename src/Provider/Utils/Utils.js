import { config } from "../configProvider";
import { Dimensions, Platform, StatusBar } from "react-native";
import { LangProvider } from "../Language_provider";
import {
  msgProvider,
} from "../messageProvider";
import Cameragallery from "../Cameragallery";
import { mediaprovider } from "../Mediaprovider";
import { apifuntion } from "../APIProvider";
import { Colors, Font } from "../Colorsfont";
import { Icons } from "../../Icons/Index";
import { ScreenHeader } from "../../Components/ScreenHeader";
import { Button } from "../../Components/Button";
import AuthInputBoxSec from "../../Components/AuthInputBoxSec";

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)

const countries = [
  {
    id: '1',
    icon: require('../../Icons/saudia.png'),
    code: '966'
  },
  {
    id: '2',
    icon: require('../../Icons/uae.png'),
    code: '971'
  }
]

export {
  config,
  Icons,
  apifuntion,
  Colors,
  Font,
  windowHeight,
  windowWidth,
  mediaprovider,
  Cameragallery,
  LangProvider,
  msgProvider,
  deviceHeight,
  StatusbarHeight,
  ScreenHeader,
  Button,
  AuthInputBoxSec,
  countries
};
