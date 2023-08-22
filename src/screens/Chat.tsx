import { View, Text, FlatList, Dimensions, StatusBar, Platform, Image, TextInput, KeyboardAvoidingView, Pressable, StyleSheet, Keyboard, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import DocumentPicker from 'react-native-document-picker'
import { getIsAppointmentChatEnabled, GetThumbnail } from '../Provider/AppFunctions'
import { ScreenHeader } from '../components/ScreenHeader'
import firestore from '@react-native-firebase/firestore'
import { config } from '../Provider/configProvider'
import { Message, MessageRoom } from '../Schemas/MessageRoomSchema'
import { Colors, Font } from '../Provider/Colorsfont'
import { vs, s } from 'react-native-size-matters'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SvgXml } from 'react-native-svg'
import { Icons, Send, _Cross } from '../Icons/Index'
import { LangProvider } from '../Provider/Language_provider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { apifuntion, Button, mediaprovider, msgProvider, windowWidth } from '../Provider/Utils/Utils'
import MediaOptions from '../components/MediaOptions'
import ChatMessage from '../components/ChatMessage'


const Chat = ({ navigation, route }) => {


    const [room, setRoom] = useState()
    const [isAutoResendable, setIsAutoResendable] = useState<Boolean>(true)
    const [messageInput, setMessageInput] = useState<string>('')
    const insets = useSafeAreaInsets()
    const messageInputRef = useRef()

    const { chatOptions, isEnabled } = route?.params

    const {
        loggedInUserDetails,
        deviceToken,
        languageIndex,
        contentAlign
    } = useSelector(state => state.StorageReducer)
    const { provider, patient, appointment } = chatOptions
    !chatOptions ? (() => { navigation.canGoBack() && navigation.goBack(); return (<></>) })() : true
    const isProvider = false
    const isNextChatEnabled = getIsAppointmentChatEnabled(appointment?.date, appointment?.acceptance_status)
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [mediaOptions, setMediaOptions] = useState(false);
    const [docs, setDocs] = useState([]);
    const [attachment, setAttachment] = useState([])
    const [type, setType] = useState('')

    let currentDate = null;
    let currentGroup = null;

    useEffect(() => {
        firestore()
            .collection(`Chats-${config.mode}`)
            .doc(appointment?.order)
            .onSnapshot(documentSnapshot => {
                const groupedMessages = [];

                if (!documentSnapshot.exists) {
                    const room = new MessageRoom({
                        ID: appointment?.order,
                        AppointmentID: appointment?.id,
                        Created: new Date(),
                        Expired: isNextChatEnabled,
                        LastOpened: new Date(),
                        Patient: {
                            ID: patient?.id,
                            Image: patient?.image,
                            IsTyping: false,
                            FCM: deviceToken
                        },
                        Provider: {
                            ID: provider?.id,
                            Image: provider?.image,
                            IsTyping: false,
                            FCM: '',
                            UserType: 'Doctor'
                        },
                        Messages: []
                    })
                    // console.log(room.MessageRoomDetails);
                    firestore()
                        .collection(`Chats-${config.mode}`)
                        .doc(appointment?.order)
                        .set(room).then(() => {
                            console.log('posted');
                        })
                } else {
                    const roomDetails = documentSnapshot.data()
                    // console.log({ roomDetails: roomDetails?.MessageRoomDetails });

                    roomDetails?.MessageRoomDetails?.Messages?.reverse()
                    roomDetails?.MessageRoomDetails?.Messages?.forEach((message: any) => {
                        const messageDate = message?.MessageDetails.DateTime?.toDate();
                        const messageDateString = messageDate.toDateString();


                        const existingGroup = groupedMessages.find((group) => group.date === messageDateString);

                        if (existingGroup) {
                            existingGroup.messages.push(message);
                        } else {
                            groupedMessages.push({ date: messageDateString, messages: [message] });
                        }
                    });
                    setRoom(groupedMessages)
                }
            })
    }, [])

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardVisible(true)
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [])



    const Galleryopen = () => {
        let tempArr = []
        mediaprovider
            .launchGellery(true)
            .then((obj) => {
                // console.log('Galleryopen..............', obj);
                setMediaOptions(false)
                const fileName = obj?.path.split('/')
                let source = {
                    data: {
                        name: Platform.OS == 'ios' ? obj.filename : fileName[fileName.length - 1],
                        type: obj.mime,
                        uri: obj?.path,
                    }
                };
                tempArr.push(source)
                setAttachment(tempArr)
                setType('image')

            })
            .catch((error) => {
                setMediaOptions(false)
                console.log('Galleryopen-error', error);
            });
    };

    const Camerapopen = async () => {
        let tempArr = []
        mediaprovider
            .launchCamera(true)
            .then((obj) => {
                // console.log('Camerapopen..............', obj);
                setMediaOptions(false)
                const fileName = obj?.path.split('/')
                let source = {
                    data: {
                        name: fileName[fileName.length - 1],
                        type: obj.mime,
                        uri: obj?.path,
                    }
                };
                tempArr.push(source)
                setAttachment(tempArr)
                setType('image')
            }).catch((error) => {
                setMediaOptions(false)
                console.log('Camerapopen..............', error);
            });
    };

    const selectFile = async () => {
        let tempArr = []
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.pdf,
                ],
                copyTo: "cachesDirectory"
            });
            // console.log('Document Pick Response', res);
            setMediaOptions(false)
            let source = {
                data: {
                    name: res[0].name,
                    type: res[0].type,
                    uri: res[0].uri,
                }
            };
            const result = await GetThumbnail(res[0].fileCopyUri)
            source = {
                data: {
                    ...source.data
                },
                thumbnail: result.uri
            }
            tempArr.push(source)
            setAttachment(tempArr)
            setType('pdf')




        } catch (err) {
            setMediaOptions(false)
            if (DocumentPicker.isCancel(err)) {
                console.log('You did not select any file')
            } else {
                console.log('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const UploadFile = async (msg: any) => {
        let url = config.baseURL + "api-chat-image";
        var data = new FormData();
        for (var i = 0; i < attachment.length; i++) {
            data.append("chat_image[]", attachment[i]?.data);
        }

        apifuntion.postApi(url, data, 1)
            .then(async (obj) => {
                if (obj.status == true) {
                    console.log("UploadFile-res...", obj);
                    if (type === 'image') {
                        msg.MessageDetails.ImagePaths = obj.result
                    } else {
                        msg.MessageDetails.DocPaths = obj.result
                    }
                    await firestore().collection(`Chats-${config.mode}`).doc(appointment?.order).update({ 'MessageRoomDetails.Messages': firestore.FieldValue.arrayUnion(msg) }).finally(() => {
                        setIsAutoResendable(true)
                    })

                } else {
                    msgProvider.showError(obj.message);
                    return false;
                }
            }).catch((error) => {
                console.log("UploadFile-error ------- " + error);
            })
    };

    const onSendMessage = async () => {

        const messageDate = new Date();
        const messageDateString = messageDate.toDateString();
        if (attachment.length == 0) {
            if (isAutoResendable) {
                setIsAutoResendable(false)
                const newMessage = new Message({
                    Body: messageInput,
                    DateTime: new Date(),
                    DocPaths: [],
                    ImagePaths: [],
                    Milliseconds: moment().valueOf(),
                    NumChars: messageInput.length,
                    ReadBit: 1,
                    SenderID: loggedInUserDetails?.user_id,
                    ReceiverID: provider?.id,
                    Shown: true,
                    SYSTEM: false
                })

                setRoom((prevMessages) => {
                    const updatedMessages = [...prevMessages];

                    const lastGroup = updatedMessages[updatedMessages.length - 1];
                    if (lastGroup && lastGroup.date === messageDateString) {
                        lastGroup.messages.push(newMessage);
                    } else {
                        updatedMessages.push({
                            date: messageDateString,
                            messages: [newMessage],
                        });
                    }

                    return updatedMessages;
                });

                setMessageInput('')
                await firestore().collection(`Chats-${config.mode}`).doc(appointment?.order).update({ 'MessageRoomDetails.Messages': firestore.FieldValue.arrayUnion(newMessage) }).finally(() => {
                    setIsAutoResendable(true)
                })
            }
        } else {
            const newMessage = new Message({
                Body: messageInput,
                DateTime: new Date(),
                DocPaths: type === 'pdf' ? [attachment[0].data.uri, attachment[0].thumbnail, attachment[0]?.data.name] : [],
                ImagePaths: type === 'image' ? [attachment[0].data.uri] : [],
                Milliseconds: moment().valueOf(),
                NumChars: messageInput.length,
                ReadBit: 1,
                ReceiverID: provider?.id,
                SenderID: loggedInUserDetails?.user_id,
                Shown: true,
                SYSTEM: false
            })
            setAttachment([])
            setRoom((prevMessages) => {
                const updatedMessages = [...prevMessages];

                const lastGroup = updatedMessages[0];
                console.log(lastGroup.date);
                if (lastGroup && lastGroup.date === messageDateString) {
                    lastGroup.messages.unshift(newMessage);
                } else {
                    updatedMessages.unshift({
                        date: messageDateString,
                        messages: [newMessage],
                    });
                }

                return updatedMessages;
            });
            setMessageInput('')
            // return
            UploadFile(newMessage)


        }

    }


    const renderMessageItem = ({ item, index }) => {

        return (

            <ChatMessage
                Item={item}
                navigation={navigation}
                Index={index}
            />
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.backgroundcolor,
            }}>
            <ScreenHeader
                navigation={navigation}
                title={LangProvider.Chat[languageIndex]}
                leftIcon
                onBackPress={() => { navigation.goBack() }}
                renderHeaderWOBack={() => {
                    return (
                        <View style={{
                            flex: 1,
                            height: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingRight: '1%'
                        }}>

                            <View style={{ width: windowWidth / 7, marginLeft: '0.5%' }}>
                                <Image style={{
                                    width: windowWidth / 10,
                                    height: windowWidth / 10,
                                    borderRadius: windowWidth / 10,
                                }}
                                    resizeMethod='scale'
                                    resizeMode='contain'
                                    source={{ uri: provider?.image }} />
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text style={{
                                    color: Colors.Black,
                                    fontFamily: Font.SemiBold,
                                    fontSize: Font.medium
                                }} allowFontScaling={false} >{provider?.name}</Text>

                                <Text style={{
                                    color: '#8F98A7',
                                    fontFamily: Font.Medium,
                                    fontSize: Font.xsmall
                                }} allowFontScaling={false} >{`Consultation ID: ${appointment?.order}`}</Text>

                            </View>

                        </View>
                    )
                }}

            />

            <KeyboardAvoidingView
                style={styles.mainContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? -13 : 0}
            >
                <View style={styles.content}>
                    <FlatList
                        style={{ flex: 1, zIndex: 2 }}
                        contentContainerStyle={{ paddingHorizontal: '2%', zIndex: 3, paddingBottom: vs(28), paddingTop: vs(32) }}
                        data={room}
                        keyExtractor={(i, _i) => 'message' + _i}
                        inverted={true}
                        renderItem={renderMessageItem}
                        showsVerticalScrollIndicator={false}
                    // ListEmptyComponent={() => (<Text style={{ width: '100%', alignSelf: 'center', textAlign: 'center' }} >No Messages</Text>)}
                    />
                </View>

                <View style={{
                    width: '100%',
                    backgroundColor: Colors.White,
                    paddingBottom: (Platform.OS == 'ios') ? insets.bottom - (windowWidth * 3) / 100 : vs(9),
                    paddingVertical: vs(9),
                    paddingHorizontal: s(13),
                }}>

                    {
                        isEnabled ?
                            <Button
                                text={LangProvider.ChatClosed[languageIndex]}
                                btnStyle={{ backgroundColor: Colors.orange }}
                                onPress={() => navigation.pop()}
                            />
                            :
                            <View
                                style={{
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{
                                    width: '88%',
                                }}>
                                    {
                                        attachment.length > 0 &&
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: Colors.Border,
                                            paddingBottom: vs(4),
                                            marginBottom: vs(4),
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-end',
                                            }}>
                                                {
                                                    type === 'image' ?
                                                        <Image
                                                            source={{ uri: attachment[0].data.uri }}
                                                            style={{ height: 50, width: 50, borderRadius: (windowWidth * 2) / 100, }}
                                                        />
                                                        :
                                                        <Image
                                                            source={Icons.Pdf}
                                                            style={{ height: 50, width: 50, borderRadius: (windowWidth * 2) / 100, }}
                                                        />
                                                }
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.DarkGrey,
                                                        paddingHorizontal: s(5),
                                                        width: '75%',
                                                    }}
                                                >
                                                    {attachment[0].data.name}
                                                </Text>
                                            </View>
                                            <TouchableHighlight
                                                onPress={() => {
                                                    setAttachment([])
                                                }}
                                                underlayColor={Colors.Highlight}
                                                style={styles.closeContainer}>
                                                <SvgXml xml={_Cross} height={vs(19)} width={s(18)} />
                                            </TouchableHighlight>

                                        </View>
                                    }
                                    {/* --------------------------------- */}
                                    <View style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        borderRadius: Platform.OS === 'ios' ? vs(15) : vs(20),
                                        backgroundColor: Colors.backgroundcolor,
                                        paddingHorizontal: vs(12),
                                        paddingVertical: Platform.OS == 'ios' ? vs(7) : 0,
                                        justifyContent: 'space-between',
                                        maxHeight: (windowWidth * 35) / 100,
                                    }}>
                                        <View style={{
                                            width: '88%',
                                            justifyContent: 'center',
                                        }}>
                                            <TextInput
                                                placeholder={LangProvider.WriteMsg[languageIndex]}
                                                placeholderTextColor={'#515C6F'}
                                                style={{
                                                    width: '100%',
                                                    color: Colors.Black,
                                                    fontSize: Font.medium,
                                                    textAlign: contentAlign

                                                }}
                                                multiline
                                                value={messageInput}
                                                returnKeyType='next'
                                                onChangeText={setMessageInput}
                                            />
                                        </View>

                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                Keyboard.dismiss()
                                                setTimeout(() => {
                                                    setMediaOptions(true)
                                                }, 350);
                                            }}
                                            style={{
                                                width: '10%',
                                                paddingVertical: Platform.OS == 'ios' ? 0 : vs(10),
                                                justifyContent: 'flex-end',
                                                alignItems: 'flex-end',
                                                // alignSelf: 'flex-end',
                                            }}>
                                            <View
                                                style={{
                                                    width: (windowWidth * 4.9) / 100,
                                                    height: (windowWidth * 4.9) / 100,
                                                    borderRadius: (windowWidth * 20) / 100,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <Image
                                                    resizeMode="contain"
                                                    source={Icons.Attachment}
                                                    style={{
                                                        width: (windowWidth * 4.4) / 100,
                                                        height: (windowWidth * 4.4) / 100,
                                                    }}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View style={{
                                    justifyContent: 'flex-end',
                                    width: '12%',
                                    alignItems: 'flex-end',
                                    // alignSelf: 'flex-end',
                                    // paddingBottom:(windowWidth*1)/100,

                                }}>
                                    <Pressable style={{
                                        backgroundColor: Colors.Theme,
                                        height: windowWidth * 0.09,
                                        marginBottom: Platform.OS === 'ios' ? vs(0.5) : vs(4),
                                        width: '80%',
                                        borderRadius: windowWidth * 0.1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                        disabled={
                                            (messageInput.trim().length <= 0 && attachment.length == 0) ?
                                                true
                                                :
                                                (messageInput.trim().length <= 0 && attachment.length > 0) ? false
                                                    :
                                                    (messageInput.trim().length > 0 || attachment.length > 0) ? false
                                                        :
                                                        false
                                        }
                                        onPress={() => {
                                            onSendMessage()
                                        }}>

                                        <SvgXml xml={Send} style={{
                                            transform: languageIndex == 1 ? [{ rotate: "180deg" }] : [{ rotate: "0deg" }]
                                        }} />
                                    </Pressable>


                                </View>

                            </View>
                    }


                </View>

            </KeyboardAvoidingView>

            <MediaOptions
                visible={mediaOptions}
                onRequestClose={() => {
                    setMediaOptions(false)
                }}
                selectedOption={(val: string) => {
                    if (val == '1') {
                        selectFile()
                    } else if (val == '2') {
                        Camerapopen()
                    } else {
                        Galleryopen()
                    }
                }}
            />


        </View>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.backgroundcolor,
    },
    content: {
        flex: 1,
        paddingHorizontal: s(2)
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: Platform.select({ ios: 0, android: 10 }), // adjust the value according to your needs
    },
    input: {
        flex: 1,
        height: 40,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    flatListView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        alignSelf: "center",
        paddingTop: 5,
        paddingBottom: 70
    },
    msgImg: {
        height: (windowWidth * 40) / 100,
        width: (windowWidth * 40) / 100,

    },
    closeContainer: {
        height: s(30),
        width: s(30),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
})
export default Chat
