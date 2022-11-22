import React from "react";
import { Images } from "../utils";
import ImagePlaceholder from "react-native-img-placeholder";

const ImageCustom = ({
  borderRadius,
  customStyles,
  onPress,
  imageUri,
  onLoading,
  avatar,
}) => {
  return (
    <ImagePlaceholder
      style={customStyles}
      //loadingStyle={{ size: 'large', color: 'blue' }}
      source={imageUri != "" ? { uri: imageUri } : Images.noimage}
      placeholderSource={avatar ? Images.avatar : Images.noimage}
      placeholderStyle={customStyles}
      borderRadius={borderRadius}
      isShowActivity={false}
    />
  );
};

export default ImageCustom;
