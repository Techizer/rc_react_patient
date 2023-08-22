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




const FileView = ({ navigation, route }) => {

    const { Images, Docs } = route?.params || ''
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (Docs.length > 0) {
            setIsLoading(true)
        }
    }, [Images, Docs])

    return (

        <View style={{ flex: 1 }}>


            <View style={styles.mainContainer}>

                    <TouchableOpacity
                        onPress={() => navigation.pop()}
                        style={styles.closeContainer}
                    >
                        <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                    </TouchableOpacity>


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
                                    style={{ height: '90%', width: windowWidth,  }}
                                    resource={Docs[0]}
                                    resourceType={'url'}
                                    onLoad={() => setIsLoading(false)}
                                    onError={(error) => console.log('Cannot render PDF', error)}
                                />
                        }
                    </View>
            </View>

    )
}
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: Colors.Black,
        justifyContent:'flex-end'
    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 9999,
        position:'absolute',
        top:'5%',
        left:'5%'
    },

});

export default FileView;


