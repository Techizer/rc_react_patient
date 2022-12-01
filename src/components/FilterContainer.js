/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import {
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

import { ThemeColors } from "../styles/main.style";
import FlushMsg from "../utils/FlushMsg";
import { ProductService } from "../services";
//import { Constants, Location, Permissions } from 'expo';
import { Images, Color, Fonts } from "../utils";
import Button from "./Button";
let ScreenHeight = Dimensions.get("window").height;
import { RF } from "../utils/responsive";

class FilterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      listData: [],
      isVisible: true,
      // loginUserData: JSON.parse(global.loginUserData),
      type: [
        {
          title: "Delivery",
          value: "Delivery",
          isSelected: false,
        },
        {
          title: "Pickup",
          value: "Pickup",
          isSelected: false,
        },
      ],
      sortBy: [
        {
          title: "Price: Low to High",
          value: "asc",
        },
        {
          title: "Price: High to Low",
          value: "desc",
        },
      ],
      customerRatings: [5, 4, 3, 2, 1],
      cuisines: [],
      categories: [],
      dietary: [],
      offers: [],
      //selectedType: (this.props.filterData.selectedType != undefined) ? this.props.filterData.selectedType : '',
      selectedSortby:
        this.props.filterData.selectedSortby != undefined
          ? this.props.filterData.selectedSortby
          : "",
      selectedRating:
        this.props.filterData.selectedRating != undefined
          ? this.props.filterData.selectedRating
          : 0,
      selectedOffer:
        this.props.filterData.selectedOffer != undefined
          ? this.props.filterData.selectedOffer
          : "",
      cuisinesArr:
        this.props.filterData.cuisinesArr != undefined
          ? this.props.filterData.cuisinesArr
          : [],
      categoriesArr:
        this.props.filterData.categoriesArr != undefined
          ? this.props.filterData.categoriesArr
          : [],
      dietaryArr:
        this.props.filterData.dietaryArr != undefined
          ? this.props.filterData.dietaryArr
          : [],
      typeArr:
        this.props.filterData.typeArr != undefined
          ? this.props.filterData.typeArr
          : [],
    };
  }

  componentDidMount() {
    this.getFilterParmasApi();
  }

  getFilterParmasApi = () => {
    // this.loaderShowHide(loadingApi);

    var myData = {
      key: this.props.filterType, //"605a2cb2703c39b"
    };
    ProductService.getFilterParmas(myData).then(
      function (result) {
        // this.loaderShowHide(false);
        if (result.status) {
          var cuisines = result?.data?.cuisines;
          cuisines.map((data, index) => {
            if (this.state.cuisinesArr.includes(data.name)) {
              data["isSelected"] = true;
            } else {
              data["isSelected"] = false;
            }
          });
          var categories = result?.data?.categories;
          categories.map((data, index) => {
            if (this.state.categoriesArr.includes(data.name)) {
              data["isSelected"] = true;
            } else {
              data["isSelected"] = false;
            }
          });
          var dietary = result?.data?.dietary;
          dietary.map((data, index) => {
            if (this.state.dietaryArr.includes(data.name)) {
              data["isSelected"] = true;
            } else {
              data["isSelected"] = false;
            }
          });
          var offers = result?.data?.offers;
          // offers.map((data, index) => {
          //     data["isSelected"] = false
          // })

          var type = this.state.type;
          type.map((data, index) => {
            if (this.state.typeArr.includes(data.value)) {
              data["isSelected"] = true;
            } else {
              data["isSelected"] = false;
            }
          });

          this.setState({
            cuisines: cuisines,
            categories: categories,
            dietary: dietary,
            offers: offers,
          });
        } else {
          //FlushMsg.showError(result.message);
        }
        console.log("result:: ", result);
      }.bind(this),
      function (result) {
        console.log("result:: ", result);
        //console.log('There was an error fetching the time');
        // this.loaderShowHide(false);
        FlushMsg.showError(result.message);
      }.bind(this)
    );
  };

  closeModalAction = () => {
    this.props.closeApplyFilter({
      ivrListVisible: false,
    });
  };

  clearAllAction = () => {
    var cuisinesArr = [];
    if (this.state.cuisines.length > 0) {
      this.state.cuisines.map((data, index) => {
        if (data.isSelected) {
          data.isSelected = false;
        }
      });
    }

    var categoriesArr = [];
    if (this.state.categories.length > 0) {
      this.state.categories.map((data, index) => {
        if (data.isSelected) {
          data.isSelected = false;
        }
      });
    }

    var dietaryArr = [];
    if (this.state.dietary.length > 0) {
      this.state.dietary.map((data, index) => {
        if (data.isSelected) {
          data.isSelected = false;
        }
      });
    }

    var offersArr = [];
    if (this.state.offers.length > 0) {
      this.state.offers.map((data, index) => {
        if (data.isSelected) {
          data.isSelected = false;
        }
      });
    }

    var typeArr = [];
    if (this.state.type.length > 0) {
      this.state.type.map((data, index) => {
        if (data.isSelected) {
          data.isSelected = false;
        }
      });
    }

    var rating = [];
    if (this.state.selectedRating.length > 0) {
      this.state.selectedRating.map((data, index) => {
        if (data.isSelected) {
          data.isSelected = false;
        }
      });
    }

    var sortBy = [];
    if (this.state.selectedSortby.length > 0) {
      this.state.selectedSortby.map((data, index) => {
        if (data.isSelected) {
          data.isSelected = false;
        }
      });
    }

    console.log(
      cuisinesArr,
      categoriesArr,
      dietaryArr,
      offersArr,
      typeArr,
      sortBy,
      rating
    );
    this.setState({
      cuisinesArr: cuisinesArr,
      categoriesArr: categoriesArr,
      dietaryArr: dietaryArr,
      selectedOffer: offersArr,
      typeArr: typeArr,
      selectedSortby: sortBy,
      selectedRating: rating,
    });
  };

  applyBtnAction = () => {
    var cuisinesArr = [];
    if (this.state.cuisines.length > 0) {
      this.state.cuisines.map((data, index) => {
        if (data.isSelected) {
          cuisinesArr.push(data.name);
        }
      });
    }

    var categoriesArr = [];
    if (this.state.categories.length > 0) {
      this.state.categories.map((data, index) => {
        if (data.isSelected) {
          categoriesArr.push(data.name);
        }
      });
    }

    var dietaryArr = [];
    if (this.state.dietary.length > 0) {
      this.state.dietary.map((data, index) => {
        if (data.isSelected) {
          dietaryArr.push(data.name);
        }
      });
    }

    // var offersArr = []
    // if (this.state.offers.length > 0) {
    //     this.state.offers.map((data, index) => {
    //         if (data.isSelected) {
    //             offersArr.push(data.name)
    //         }
    //     })
    // }

    var typeArr = [];
    if (this.state.type.length > 0) {
      this.state.type.map((data, index) => {
        if (data.isSelected) {
          typeArr.push(data.value);
        }
      });
    }

    console.log(
      cuisinesArr,
      categoriesArr,
      dietaryArr,
      this.state.selectedOffer,
      typeArr,
      this.state.selectedSortby,
      this.state.selectedRating
    );
    this.props.selectApplyFilter({
      cuisinesArr: cuisinesArr,
      categoriesArr: categoriesArr,
      dietaryArr: dietaryArr,
      selectedOffer: this.state.selectedOffer,
      typeArr: typeArr,
      selectedSortby: this.state.selectedSortby,
      selectedRating: this.state.selectedRating,
    });
  };

  /**
   * render() this the main function which used to display different view
   * and contain all view related information.
   */

  returnRatingView = (data) => {
    var ratings = [];
    for (let i = 0; i < data; i++) {
      ratings.push(
        <Image
          style={{
            tintColor:
              data == this.state.selectedRating
                ? Color.whiteColor
                : Color.primaryColor,
          }}
          source={Images.starFill}
        />
      );
    }
    return ratings;
  };

  render() {
    const { type, sortBy, customerRatings } = this.state;
    return (
      <Modal
        propagateSwipe={50}
        animationType="fade"
        transparent={true}
        visible={true}
        coverScreen={true}
        onRequestClose={() => {}}
      >
        {/* <ScrollView
                    scrollEnabled={enableScrollViewScroll}
                    showsVerticalScrollIndicator={false}> */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              margin: 0,
              backgroundColor: ThemeColors.whiteColor,
              borderRadius: 6,
              padding: 15,
              paddingTop: 40,
              width: "100%",
              height: ScreenHeight,
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                position: "relative",
                right: 0,
                top: 0,
                zIndex: 1,
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
              }}
              onPress={() => {
                this.closeModalAction(false);
              }}
            >
              <Image
                source={require("../assets/images/close.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 10,
              }}
            >
              <ScrollView
                keyboardShouldPersistTaps={"handled"}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Choose Type
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      // backgroundColor: 'red',
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {type.map((data, index) => {
                      return (
                        <>
                          <TouchableOpacity
                            style={{
                              padding: 6,
                              backgroundColor: data?.isSelected
                                ? Color.primaryColor
                                : Color.greyApp,
                              borderRadius: 6,
                              marginRight: 10,
                              marginBottom: 10,
                            }}
                            onPress={() => {
                              data["isSelected"] = !data?.isSelected;
                              this.setState({
                                type: this.state.type,
                              });
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                color: data?.isSelected
                                  ? Color.whiteColor
                                  : Color.blackColor,
                              }}
                            >
                              {data.title}
                            </Text>
                          </TouchableOpacity>
                        </>
                      );
                    })}
                  </View>
                </View>

                <View
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Offers
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      // backgroundColor: 'red',
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.state.offers.length > 0 &&
                      this.state.offers.map((data, index) => {
                        return (
                          <>
                            <TouchableOpacity
                              style={{
                                padding: 6,
                                backgroundColor:
                                  data?.name == this.state.selectedOffer
                                    ? Color.primaryColor
                                    : Color.greyApp,
                                borderRadius: 6,
                                marginRight: 10,
                                marginBottom: 10,
                              }}
                              onPress={() => {
                                //data["isSelected"] = !data?.isSelected

                                this.setState({
                                  selectedOffer:
                                    data?.name == this.state.selectedOffer
                                      ? ""
                                      : data?.name,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  color:
                                    data?.name == this.state.selectedOffer
                                      ? Color.whiteColor
                                      : Color.blackColor,
                                }}
                              >
                                {data?.name}
                              </Text>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                  </View>
                </View>

                <View
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Cuisines
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      // backgroundColor: 'red',
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.state.cuisines.length > 0 &&
                      this.state.cuisines.map((data, index) => {
                        return (
                          <>
                            <TouchableOpacity
                              style={{
                                padding: 6,
                                backgroundColor: data.isSelected
                                  ? Color.primaryColor
                                  : Color.greyApp,
                                borderRadius: 6,
                                marginRight: 10,
                                marginBottom: 10,
                              }}
                              onPress={() => {
                                data["isSelected"] = !data?.isSelected;
                                this.setState({
                                  cuisines: this.state.cuisines,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: data.isSelected
                                    ? Color.whiteColor
                                    : Color.blackColor,
                                }}
                              >
                                {data?.name}
                              </Text>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                  </View>
                </View>

                <View
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Categories
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      // backgroundColor: 'red',
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.state.categories.length > 0 &&
                      this.state.categories.map((data, index) => {
                        return (
                          <>
                            <TouchableOpacity
                              style={{
                                padding: 6,
                                backgroundColor: data.isSelected
                                  ? Color.primaryColor
                                  : Color.greyApp,
                                borderRadius: 6,
                                marginRight: 10,
                                marginBottom: 10,
                              }}
                              onPress={() => {
                                data["isSelected"] = !data?.isSelected;
                                this.setState({
                                  categories: this.state.categories,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: data.isSelected
                                    ? Color.whiteColor
                                    : Color.blackColor,
                                }}
                              >
                                {data?.name}
                              </Text>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                  </View>
                </View>

                <View
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Dietary
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      // backgroundColor: 'red',
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.state.dietary.length > 0 &&
                      this.state.dietary.map((data, index) => {
                        return (
                          <>
                            <TouchableOpacity
                              style={{
                                padding: 6,
                                backgroundColor: data.isSelected
                                  ? Color.primaryColor
                                  : Color.greyApp,
                                borderRadius: 6,
                                marginRight: 10,
                                marginBottom: 10,
                              }}
                              onPress={() => {
                                data["isSelected"] = !data?.isSelected;
                                this.setState({
                                  dietary: this.state.dietary,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: data.isSelected
                                    ? Color.whiteColor
                                    : Color.blackColor,
                                }}
                              >
                                {data?.name}
                              </Text>
                            </TouchableOpacity>
                          </>
                        );
                      })}
                  </View>
                </View>

                {/* <View style={{
                                    marginBottom: 20
                                }}>
                                    <View style={{
                                        marginBottom: 15
                                    }}>
                                        <Text style={{
                                            fontWeight: "bold",
                                            fontSize: 15
                                        }}>
                                            Sort by
                                        </Text>
                                    </View>
                                    <View style={{
                                        width: "100%",
                                        // backgroundColor: 'red',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}>
                                        {
                                            sortBy.map((data, index) => {
                                                return (
                                                    <>
                                                        <TouchableOpacity style={{
                                                            padding: 6,
                                                            backgroundColor: (data.value == this.state.selectedSortby) ? Color.primaryColor : Color.greyApp,
                                                            borderRadius: 6,
                                                            marginRight: 10,
                                                            marginBottom: 10
                                                        }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    selectedSortby: data.value
                                                                })
                                                            }}
                                                        >
                                                            <Text style={{
                                                                fontSize: 12,
                                                                color: (data.value == this.state.selectedSortby) ? Color.whiteColor : Color.blackColor
                                                            }}>
                                                                {data.title}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </>
                                                )
                                            })
                                        }


                                    </View>
                                </View> */}

                <View>
                  <View
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Customer Ratings
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      // backgroundColor: 'red',
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {customerRatings.map((data, index) => {
                      return (
                        <>
                          <TouchableOpacity
                            style={{
                              padding: 6,
                              backgroundColor:
                                data == this.state.selectedRating
                                  ? Color.primaryColor
                                  : Color.greyApp,
                              borderRadius: 6,
                              marginRight: 10,
                              marginBottom: 10,
                              flexDirection: "row",
                            }}
                            onPress={() => {
                              this.setState({
                                selectedRating:
                                  data == this.state.selectedRating ? 0 : data,
                              });
                            }}
                          >
                            {this.returnRatingView(data)}
                          </TouchableOpacity>
                        </>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: "flex-start",
                  position: "relative",
                  left: 0,
                  bottom: 0,
                  zIndex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                  textAlign: "center",
                  width: "35%",
                }}
                onPress={() => {
                  this.clearAllAction();
                }}
              >
                <Button
                  text={"Clear All"}
                  onLoading={this.state.loading}
                  customStyles={{
                    // mainContainer: {
                    //     backgroundColor: Color.whiteColor,
                    // },
                    mainContainer: {
                      backgroundColor: Color.whiteColor,
                      borderWidth: 1,
                      borderColor: Color.blackColor,
                    },
                    buttonText: {
                      fontSize: RF(18),
                      color: "black", //Color.White,
                      fontFamily: Fonts.semibold,
                    },
                    //img: signinstyles.mail1
                  }}
                  onPress={() => this.clearAllAction()}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  position: "relative",
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                  textAlign: "center",
                  width: "55%",
                }}
                onPress={() => {
                  this.closeModalAction(false);
                }}
              >
                <Button
                  text={"Apply"}
                  onLoading={this.state.loading}
                  customStyles={
                    {
                      // mainContainer: styles.butonContainer
                    }
                  }
                  onPress={() => this.applyBtnAction()}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </Modal>
    );
  }
}

export default FilterContainer;
