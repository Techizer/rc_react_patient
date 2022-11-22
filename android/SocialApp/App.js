import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, AppConsumer } from './src/Provider/context/AppProvider';
import { firebaseprovider } from './src/Provider/FirebaseProvider';
import Stacknav from './src/Provider/Routenavigation';
global.MapAddress='NA';
console.disableYellowBox = true;
class App extends Component{
  
  render()
  {
    const linking = {
      prefixes: ["Eventpal://"], //prefixes can be anything depend on what you have wrote in intent filter
      config: {
        initialRouteName: "Product_gallery_detaile",  //define initial page jis page pr redirect krna h
        screens: {
          Product_gallery_detaile : {    //define page name
            path:"Product_gallery_detaile/:product_id",   //define url path pagename/:id ka name option h ydi aap is page pr use kr rhe ho to hi likhna h
          },
          Gallery_detaile: {
            path: "Gallery_detaile/:product_id"      //define page name          
          },
            // This is the path defind where you want to navigate the page and what action youwant to perform                  
                                  //Like in this case we are passing the id
        }
      }
    }
    return (
      <NavigationContainer linking={linking}>
      <AppProvider {...this.props}>
         <AppConsumer>{funcs => {
           global.props = { ...funcs }
           return <Stacknav {...funcs} />
         }}
       </AppConsumer>
     </AppProvider>
  </NavigationContainer>

  );
}
}

export default App;



