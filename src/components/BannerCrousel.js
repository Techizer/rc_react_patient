import React, { useState, useRef, useEffect } from 'react'
import { Text, View, TouchableOpacity, Image, TextInput, Dimensions, Animated, FlatList, Linking, ActivityIndicator } from 'react-native'
import { s, vs, ms, mvs } from 'react-native-size-matters';

import { Colors } from '../Provider/Colorsfont';
import { config, Icons, windowWidth } from '../Provider/Utils/Utils';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = (6 / 16) * BannerWidth;

const Paginator = ({ d, scrollX }) => {

    return (
        <View style={{ flexDirection: config.textalign === 'left' ? 'row' : 'row-reverse', justifyContent: 'center', alignItems: 'center', marginTop: vs(4) }}>
            {
                d &&
                d.map((_, i) => {
                    const inputRange = [(i - 1) * BannerWidth, i * BannerWidth, (i + 1) * BannerWidth]
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 10, 10],
                        extrapolate: 'clamp'
                    })
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })
                    return <Animated.View style={{

                        height: 10,
                        borderRadius: 10,
                        width: dotWidth,
                        backgroundColor: Colors.Theme,
                        margin: 2,
                        opacity: opacity,
                        borderColor: Colors.backgroundcolor,
                        borderWidth: 1

                    }} key={i.toString()} />
                })
            }
        </View>
    )
}

const ImageLoader = (props) => {
    const { load } = props


    return (
        <ActivityIndicator
            size='small'
            color={Colors.Primary}
            animating={load}
            style={[{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 999,
            }]}
        />
    )
}

const BannerCrousel = ({ data, navigation }) => {


    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)


    const onLoadStart = () => {
        setIsLoading(true)
    }

    const onLoad = () => {
        setIsLoading(false)
    }
    const slidesRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current

    const viewConfig = useRef({
        viewAreaCoveragePercentThreshold: 0
    }).current


    let i = currentIndex;

    useEffect(() => {
        const t = setTimeout(() => {

            if (currentIndex < data?.length) {
                setCurrentIndex(currentIndex => { return currentIndex + 1 })
            }
            else {
                setCurrentIndex(currentIndex => 0)
            }

            slidesRef?.current.scrollToIndex({ animated: true, index: (currentIndex < data.length) ? currentIndex : data.length - 1 })

        }, 2500)

        return () => {
            clearTimeout(t);
        };
    }, [currentIndex]);

    return (

        <View style={{ marginTop: vs(7), flexDirection: 'column', width: windowWidth, backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center', paddingVertical: vs(9) }}>

            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={data}
                renderItem={({ item, index }) => {
                    return (
                        <View
                            style={[
                                { width: windowWidth },
                                config.language == 1
                                    ? { marginLeft: (windowWidth * 1) / 100 }
                                    : null,
                                { paddingHorizontal: s(12) }
                            ]}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                            // onPress={() =>
                            //     navigation.navigate("CovidPackageDetails")
                            // }
                            >
                                <Image
                                    source={{ uri: config.img_url3 + item?.bannerimage }}
                                    style={{
                                        width: "100%",
                                        // resizeMode: "contain",
                                        height: vs(115),
                                        borderRadius: 10
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                }}
                pagingEnabled
                bounces={false}
                onScroll={
                    Animated.event([{
                        nativeEvent: {
                            contentOffset: { x: scrollX }
                        }
                    }], {
                        useNativeDriver: false
                    })
                }
                scrollEventThrottle={0}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
                centerContent
                style={{
                    margin: 0,
                    padding: 0
                }}
            />
            {
                data.length > 1 &&
                <Paginator {...{ d: data, scrollX }} />
            }
        </View>



    );

}


export default BannerCrousel