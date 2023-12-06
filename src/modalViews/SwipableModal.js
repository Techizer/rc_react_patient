import { Text, View, Image, TextStyle, ViewStyle, Dimensions, ViewProps, FlatList, TouchableOpacity, Keyboard, StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from '@react-navigation/native';



const SwipableModal = React.memo(({
    sheetRef,
    onClose=() => { },
    height,
    children
}) => {

    const { reset } = useNavigation()

    const InnerStyles = useMemo(() => {
        return StyleSheet.create({


        })
    }, [])

    return (
        <RBSheet
            animationType='slide'
            // minClosingHeight={windowHeight/2}
            ref={sheetRef}
            closeOnPressBack={false}
            closeOnDragDown={true}
            dragFromTopOnly={false}
            height={(height ?? 300)}
            openDuration={350}
            closeDuration={250}
            // onClose={onClose}
            customStyles={{
                wrapper: {
                    backgroundColor: 'rgba(0,0,0,0.2)'
                },
                container: {
                    borderTopLeftRadius: (10),
                    borderTopRightRadius: (10),
                },
                draggableIcon: {
                    // height:0,
                    // width:0,
                    // backgroundColor:'pink'
                }
            }}
        >

            {children}

        </RBSheet>

    )
})

export default SwipableModal;