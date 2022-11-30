import { config } from "../configProvider";
import { Dimensions, Platform, StatusBar } from "react-native";
import { localStorage } from "../localStorageProvider";
import { Lang_chg } from "../Language_provider";
import { consolepro } from "../Messageconsolevalidationprovider/Consoleprovider";
import {
  msgProvider,
  msgTitle,
  msgText,
} from "../Messageconsolevalidationprovider/messageProvider";
import { validation } from "../Messageconsolevalidationprovider/Validation_provider";
import { Currentltlg } from "../Curentlatlong";
import Cameragallery from "../Mediaprovider/Cameragallery";
import { mediaprovider } from "../Mediaprovider/Mediaprovider";
// import {SocialLogin} from '../Apicallingprovider/SocialLoginProvider';
import { apifuntion } from "../Apicallingprovider/apiProvider";
import { Colors, Font } from "../Colorsfont";
import { Icons } from "../Localimage";
// import Mapprovider from '../Mapprovider';
import Otpprovider from "../Otpprovider";
// import MapproviderLocationShow from '../MapproviderLocationShow';
// import {notification} from '../NotificationProvider'
import Footer from "../Footer";

// import {Firstlogin} from '../../Firstlogin'
// import {pushnotification} from '../Pushnotificationredirection';
const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)


export {
  config,
  Otpprovider,
  Icons,
  apifuntion,
  Colors,
  Footer,
  Font,
  validation,
  windowHeight,
  windowWidth,
  mediaprovider,
  Cameragallery,
  localStorage,
  Lang_chg,
  consolepro,
  msgProvider,
  msgTitle,
  msgText,
  Currentltlg,
  deviceHeight,
  StatusbarHeight
};
