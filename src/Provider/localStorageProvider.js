import AsyncStorage  from "@react-native-community/async-storage";

class localStorageProvider {
    setItemString(key, value) {
        // console.log('setItemString key',key);
         try {
               AsyncStorage.setItem(key, value);
             } catch (error) {
               console.log('Error13',error);
        }
    }

    getItemString(key) {
        // console.log('getItemObject key',key);
        var item = AsyncStorage.getItem(key);
        return item;
    }

    async setItemObject(key, item) {
        // console.log('setItemObject key',key);
        // console.log('setItemObject item',item);
        try {
            await AsyncStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.log('Error12',error);
        }
    }
 
    async getItemObject(key) {
        // console.log('getItemObject key',key);
        var item = await AsyncStorage.getItem(key);
        return JSON.parse(item);
    }

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('Error ' + error.value);
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Error ' + error.value);
        }
    }
}

export const localStorage = new localStorageProvider();
