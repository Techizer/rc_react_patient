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
import { ScreenHeader } from "../../components/ScreenHeader";
import { Button } from "../../components/Button";
import AuthInputBoxSec from "../../components/AuthInputBoxSec";

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)


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
};
