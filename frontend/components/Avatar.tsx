import { colors, radius } from "@/constants/theme";
import {AvatarProps} from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, View ,Text} from "react-native";  
import {Image} from "expo-image";
import { getAvatarPath } from "@/services/imageService";

const Avatar = ({size = 40, uri, style, isGroup = false}:AvatarProps) => {

    return(
       <View style={[styles.avatar, style ,
        {height: verticalScale(size), width: verticalScale(size)},
        style
       ]}>
        <Image
          style={{flex : 1}}
          source={getAvatarPath(uri,isGroup)}
          contentFit="cover"
          transition={100}/>
       </View>
    )
}

export default Avatar;
 
const styles = StyleSheet.create({
    avatar:{
        alignSelf:"center",
        backgroundColor: colors.neutral300,
        height: verticalScale(47),
        width: verticalScale(47),
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.neutral100,
        overflow: "hidden",
    }
})