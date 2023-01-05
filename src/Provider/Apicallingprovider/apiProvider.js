import NetInfo from "@react-native-community/netinfo";

class ApiContainer {
  getApi = async (url, loading_status = 0) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected == true) {
          if (loading_status == 0) {
            global.props.showLoader();
          }
          fetch(url, {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: 0,
              "x-api-key": "Shyam@12345",
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          })
            .then((response) => response.json())
            .then((obj) => {
              if (loading_status == 0) {
                global.props.hideLoader();
              }
              resolve(obj);
            })
            .catch((error) => {
              if (loading_status == 0) {
                global.props.hideLoader();
              }
              reject(error);
            });
        } else {
          if (loading_status == 0) {
            global.props.hideLoader();
          }
          reject("noNetwork");
        }
      });
    });
  }

  postApi = async (url, data, loading_status = 0) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected == true) {
          if (loading_status == 0) {
            global.props.showLoader();
          }
          // global.props.showLoader();
          fetch(url, {
            method: "POST",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: 0,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              "x-api-key": "Shyam@12345",
            },
            body: data,
          })
            .then((response) => response.json())
            .then((obj) => {
              if (loading_status == 0) {
                global.props.hideLoader();
              }
              resolve(obj);
            })
            .catch((error) => {
              console.log("error", error);
              if (loading_status == 0) {
                global.props.hideLoader();
              }
              reject(error);
            });
        } else {
          // global.props.hideLoader();
          reject("noNetwork");
        }
      });
    });
  }
}

//--------------------------- Config Provider End -----------------------
export const apifuntion = new ApiContainer();
