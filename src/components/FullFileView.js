import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, } from "react-native";
import PDFView from 'react-native-view-pdf';
import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, LangProvider, windowHeight,
} from "../Provider/Utils/Utils";
import { Cross, dummyUser, Edit } from "../Icons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { SkypeIndicator } from "react-native-indicators";




const FullFileView = ({
    visible,
    onRequestClose,
    Images,
    Docs
}) => {

    const { address, loggedInUserDetails, guest, languageIndex, contentAlign, } = useSelector(state => state.StorageReducer)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        if (Docs.length > 0) {
            setIsLoading(true)
        }
    }, [Images, Docs])

    return (

        <View style={{ flex: 1 }}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >
                {/* <BlurView
                    style={{
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        // zIndex: 999
                    }}
                    blurType='ultraThinMaterialDark'
                    blurAmount={15}
                    reducedTransparencyFallbackColor="white"
                /> */}

                <View style={styles.mainContainer}>

                    <View style={styles.subContainer}>
                        <TouchableOpacity
                            onPress={onRequestClose}
                            style={styles.closeContainer}
                        >
                            <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                        </TouchableOpacity>
                        <View style={styles.modalContainer}>

                            {
                                isLoading &&
                                <View
                                    style={[{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        zIndex: 999,
                                    }]}>
                                    <SkypeIndicator color={Colors.Theme} size={25} />
                                </View>
                            }

                            {
                                Images.length > 0 ?
                                    //  {/* <ImageZoom
                                    //     cropWidth={windowWidth}
                                    //     cropHeight={windowHeight}
                                    //     imageWidth={windowWidth}
                                    //     imageHeight={windowHeight}> */}
                                    <Image
                                        onLoadStart={() => {
                                            setIsLoading(true)
                                        }}
                                        onLoadEnd={() => {
                                            setIsLoading(false)

                                        }}
                                        source={{ uri: Images[0] }}
                                        style={{
                                            height: '100%',
                                            width: windowWidth,
                                            // borderRadius: (windowWidth * 3) / 100,
                                        }}
                                        resizeMode='contain'
                                    />
                                    :
                                    <PDFView
                                        fadeInDuration={250.0}
                                        style={{ height: '100%', width: windowWidth }}
                                        resource={Docs[0]}
                                        resourceType={'url'}
                                        onLoad={() => setIsLoading(false)}
                                        onError={(error) => console.log('Cannot render PDF', error)}
                                    />
                            }
                        </View>
                    </View>

                </View>

            </Modal>
        </View>


    )
}
const styles = StyleSheet.create({

    mainContainer: {
        width: windowWidth,
        height: windowHeight,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    subContainer: {
        width: windowWidth,
        height: windowHeight / 1.35,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 1.5,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: vs(20),
        position: 'absolute',
        bottom: 0,
        zIndex: 9999

    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.LightBlack,
        zIndex: 999
    },
    viewWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    // pdf: {
    //     flex: 1,
    //     width: width,
    //     height: height,
    //     backgroundColor:Colors.White
    // },

});

export default FullFileView;


