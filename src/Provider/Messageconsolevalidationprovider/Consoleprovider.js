import React from 'react';
class Consoleprovider {
	//----------------- message buttons
      consolelog(key,message)
         {
          return console.log(key, message)
          //  return null
         }
	
}

export const consolepro = new Consoleprovider();