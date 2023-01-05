import React from 'react';
import Share from 'react-native-share'
import {Linking} from 'react-native';

import { config } from './configProvider';
class ShareappPro {
	//----------------- message buttons
      sharefunction(link)
         {
        let shareOptions={
        title: 'roots care ap',
         subject:'roots care app APP',
        message:'roots care app APP'+"\n"+link,
         //url: link,
        failOnCancel: false,
     };
          Share.open(shareOptions)
         }

         
         Rateusfunction=(link)=>{
            Linking.openURL(link).catch(err =>
                alert('Please check for the Google Play Store')
           );
          }
	
}


  

export const Shareratepro = new ShareappPro();