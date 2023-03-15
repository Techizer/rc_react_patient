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
import { windowWidth } from '../Provider/Utils/Utils'
import FullFileView from './FullFileView'



const ChatMessage = ({
    Item
}) => {

    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);
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

    const messageItem = new Message(Item?.MessageDetails)
    const { MessageDetails, isSentByMe } = messageItem
    const { Body, SYSTEM, ImagePaths, DocPaths } = MessageDetails
    const isMine = isSentByMe(loggedInUserDetails?.user_id)

    var str = moment(MessageDetails.Milliseconds).format('hh:mm A, DD MMM YY')

    const onTextLayout = useCallback(e => {
        setLengthMore(e.nativeEvent.lines.length >= 4);
        // console.log(e.nativeEvent);
    }, []);
    return (

        <View style={{
            width: '100%',
            alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
            justifyContent: 'center',
            zIndex: 5,
        }}>
            <View style={{
                // width: SYSTEM ? (windowWidth/1.2): (windowWidth/1.2),
                maxWidth: SYSTEM ? (windowWidth / 1.3) : (windowWidth / 1.2),
                alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
            }}>
                <View style={{
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
                                    width: (windowWidth / 1.4),
                                    // maxWidth: (windowWidth / 1.2),
                                    alignSelf: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                                }]}>
                                <Text
                                    style={{
                                        textAlign: SYSTEM ? 'left' : 'left',
                                        color: isMine ? '#FFFFFF' : Colors.lightGrey,
                                        fontFamily: Font.Regular,
                                        fontSize: Font.small,


                                    }} >{isMine ? 'SYMPTOMS:' : 'PRESCRIBED MEDICINES'}</Text>

                                {
                                    Body != '' &&
                                    <>
                                        <Text
                                            onTextLayout={onTextLayout}
                                            numberOfLines={textShown ? undefined : 4}
                                            style={{
                                                textAlign: SYSTEM ? 'left' : 'left',
                                                color: isMine ? '#FFFFFF' : '#0C1016',
                                                fontFamily: Font.Regular,
                                                fontSize: 11,
                                                marginTop: vs(5)
                                            }} >{Body}</Text>
                                        {
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
                                        }
                                    </>
                                }
                                <View style={{ borderTopWidth: 0.5, borderTopColor: isMine ? Colors.White : Colors.Border, marginVertical: vs(3) }} />

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        setIsFileVisible(true)
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: SYSTEM ? 'left' : 'left',
                                            color: isMine ? '#FFFFFF' : Colors.Theme,
                                            fontFamily: isMine ? Font.Regular : Font.Medium,
                                            fontSize: Font.xsmall,
                                            marginTop: vs(5)

                                        }} >{isMine ? 'VIEW SYMPTOMS' : 'VIEW PRESCRIPTION'}</Text>
                                </TouchableOpacity>

                            </View>
                            :
                            <>
                                <Text
                                    onTextLayout={onTextLayout}
                                    numberOfLines={textShown ? undefined : 8}
                                    style={{
                                        textAlign: SYSTEM ? 'left' : 'left',
                                        color: SYSTEM ? '#A47C32' : isMine ? '#FFFFFF' : '#0C1016',
                                        fontFamily: Font.Regular,
                                        fontSize: SYSTEM ? Font.small : Font.medium,


                                    }} >{Body}</Text>
                                {
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
                                }
                            </>
                    }
                </View>

                {!SYSTEM &&
                    <Text style={{
                        textAlign: isMine ? 'right' : 'left',
                        color: '#8F98A7',
                        fontFamily: Font.Regular,
                        fontSize: Font.xsmall,
                        width: '100%',
                        marginTop: vs(3),


                    }}>
                        {str}
                    </Text>
                }

            </View>

            <FullFileView
                visible={isFileVisible}
                onRequestClose={() => {
                    setIsFileVisible(false)
                }}
                Images={ImagePaths}
                Docs={DocPaths}
            />

        </View>

    )

}

const styles = StyleSheet.create({
    msgImg: {
        height: (windowWidth * 40) / 100,
        width: '92%',
        maxWidth: '92%',

    }
})
export default ChatMessage;