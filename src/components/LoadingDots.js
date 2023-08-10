
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

const LoadingDots = ({
    title
}) => {
    const [dots, setDots] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots % 3) + 1);
        }, 1000); // Change dots every 1000ms (1 second)

        return () => clearInterval(interval);
    }, []);

    const getLoadingText = () => {
        let loadingText = title;
        for (let i = 0; i < dots; i++) {
            loadingText += '.';
        }
        return loadingText;
    };

    return (
        <Text
            style={{
                color: "#515C6F",
                marginTop: 4,
                alignSelf: 'center'
            }}
        >{getLoadingText()}</Text>
    );
};

export default LoadingDots;

