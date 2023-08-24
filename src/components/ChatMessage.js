import { View, Text, Dimensions, StatusBar, Platform, Image, Pressable, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Message, MessageRoom } from '../Schemas/MessageRoomSchema'
import { Colors, Font } from '../Provider/Colorsfont'
import { vs, s } from 'react-native-size-matters'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { SvgXml } from 'react-native-svg'
import { LangProvider } from '../Provider/Language_provider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icons, windowWidth } from '../Provider/Utils/Utils'
import FullFileView from './FullFileView'


const ChatMessage = ({
    Item,
    navigation,
    Index
}) => {

    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);
    const [distance, setDistance] = useState(0);
    const [gap, setGap] = useState(0);
    const [isFileVisible, setIsFileVisible] = useState(false);
    const toggleNumberOfLines = () => {
        setTextShown(!textShown);
    }

    const insets = useSafeAreaInsets()
    const messageInputRef = useRef()

    const {
        loggedInUserDetails,
        deviceToken,
        languageIndex
    } = useSelector(state => state.StorageReducer)

    const onTextLayout = useCallback(e => {
        if (e.nativeEvent.lines.length >= 4) console.log(e.nativeEvent.lines.length >= 4)
        setLengthMore(e.nativeEvent.lines.length >= 4);
    }, []);

    return (
        <>

            {
                Item?.messages.map((message, index) => {

                    const { Body, SYSTEM, ImagePaths, DocPaths } = message.MessageDetails
                    const isMine = JSON.parse(message.MessageDetails.SenderID == loggedInUserDetails?.user_id)
                    var time = moment(message.MessageDetails.Milliseconds).format('h:mm A')


                    return (
                        <>
                            <View
                                key={index}
                                style={{
                                    width: '100%',
                                    alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                                    justifyContent: 'center',
                                    zIndex: 5,
                                    marginBottom: SYSTEM ? vs(8) : vs(5),
                                }}>
                                <View style={{
                                    maxWidth: SYSTEM ? (windowWidth / 1.3) : (windowWidth / 1.4),
                                    alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                                }}>
                                    <Pressable
                                        onPress={() => {
                                            if (ImagePaths?.length > 0 || DocPaths?.length > 0) {
                                                navigation.navigate('FileView', { Images: ImagePaths, Docs: DocPaths })
                                            }
                                        }}
                                        style={{
                                            backgroundColor: SYSTEM ? '#FFF2D9' : isMine ? Colors.Theme : '#FFFFFF',
                                            padding: 8,
                                            borderRadius: 8,
                                        }}>

                                        {
                                            (ImagePaths?.length > 0 || DocPaths?.length > 0) ?
                                                <View
                                                    style={[{
                                                        backgroundColor: isMine ? Colors.Theme : '#FFFFFF',
                                                        borderRadius: 8,
                                                        width: (windowWidth / 2),
                                                        alignSelf: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                                                    }]}>

                                                    {
                                                        DocPaths.length > 0 ?
                                                            <View style={{
                                                                width: '100%',
                                                                height: (windowWidth / 3),
                                                                borderRadius: 8,
                                                                backgroundColor: Colors.Highlight
                                                            }}>
                                                                <View style={{
                                                                    height: (windowWidth / 4.4),
                                                                    width: '100%',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    {/* <Image
                                                                        source={{ uri: DocPaths[1] }}
                                                                        style={{ height: '100%', width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, }}
                                                                        resizeMode='cover'
                                                                    /> */}
                                                                    <Image
                                                                        source={Icons.Pdf}
                                                                        style={{ height: '90%', width: '90%', alignSelf: 'center' }}
                                                                        resizeMode='contain'
                                                                    />

                                                                </View>

                                                                <View style={{
                                                                    flexDirection: 'row',
                                                                    height: '30%',
                                                                    alignItems: 'center',
                                                                }}>

                                                                    <Text
                                                                        numberOfLines={1}
                                                                        style={{
                                                                            fontSize: Font.small,
                                                                            fontFamily: Font.Regular,
                                                                        }}>{DocPaths[1]}</Text>
                                                                </View>
                                                            </View>
                                                            :
                                                            <Image
                                                                source={{ uri: ImagePaths[0] }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: windowWidth / 3,
                                                                    borderRadius: 8,
                                                                }}
                                                            />
                                                    }

                                                    {
                                                        Body != '' &&
                                                        <>
                                                            <Text
                                                                style={{
                                                                    textAlign: SYSTEM ? 'left' : 'left',
                                                                    color: isMine ? '#FFFFFF' : '#0C1016',
                                                                    fontFamily: Font.Regular,
                                                                    fontSize: 11,
                                                                    marginTop: vs(5)
                                                                }} >{Body}</Text>


                                                        </>
                                                    }
                                                    {
                                                        !SYSTEM &&
                                                        <Text style={{
                                                            textAlign: 'right',
                                                            color: isMine ? Colors.White : '#8F98A7',
                                                            fontFamily: Font.Regular,
                                                            fontSize: Font.xsmall,
                                                            width: '100%',
                                                            marginTop: vs(3),


                                                        }}>
                                                            {time}
                                                        </Text>
                                                    }


                                                </View>
                                                :
                                                <>

                                                    <Text
                                                        style={{
                                                            textAlign: SYSTEM ? 'left' : 'left',
                                                            color: SYSTEM ? '#A47C32' : isMine ? '#FFFFFF' : '#0C1016',
                                                            fontFamily: Font.Regular,
                                                            fontSize: SYSTEM ? Font.small : Font.medium,


                                                        }} >{Body}</Text>

                                                    {!SYSTEM &&
                                                        <Text style={{
                                                            textAlign: 'right',
                                                            color: isMine ? Colors.White : '#8F98A7',
                                                            fontFamily: Font.Regular,
                                                            fontSize: Font.xsmall,
                                                            marginTop: windowWidth / 40,
                                                            alignSelf: 'flex-end'
                                                        }}>
                                                            {time}
                                                        </Text>
                                                    }

                                                    {/* {
                                                        lengthMore ?
                                                            <Text
                                                                onPress={toggleNumberOfLines}
                                                                style={{
                                                                    fontSize: Font.small,
                                                                    fontFamily: Font.Regular,
                                                                    marginTop: 10,
                                                                    color: SYSTEM ? '#A47C32' : isMine ? '#FFFFFF' : '#0C1016',
                                                                }}>{textShown ? 'Read less' : 'Read more'}</Text>
                                                            : null
                                                    } */}
                                                </>
                                        }
                                    </Pressable>
                                </View>



                            </View>
                        </>
                    )
                })
            }


            <View style={styles.date}>
                <View style={styles.horizontalLine}></View>
                <View style={{
                    backgroundColor: Colors.backgroundcolor,
                    paddingHorizontal: 10,
                    position: 'absolute',
                    alignSelf: 'center',
                    zIndex: 9999,
                    paddingBottom: 3
                }}>
                    <Text>{Item.date}</Text>
                </View>
            </View>


        </>

    )

}

const styles = StyleSheet.create({
    msgImg: {
        height: (windowWidth * 40) / 100,
        width: '92%',
        maxWidth: '92%',

    },
    date: {
        height: windowWidth / 10,
        width: '100%',
        justifyContent: 'center',

    },
    horizontalLine: {
        width: '100%',
        height: 0.4,
        backgroundColor: Colors.lightGrey,
    },
})
export default ChatMessage;