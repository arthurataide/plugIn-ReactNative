import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import theme from "../theme";

const layoutTypes = {
    default: "default",
    filled: "filled",
}

export default ({ title, onPress, loading = false, layout = layoutTypes.default,  marginBottom, small = false}) => (
  <View style={[styles.container, {marginBottom: marginBottom}]}>
    <TouchableOpacity style={
        [
          layout == layoutTypes.filled 
        ? styles.filledButton
        : styles.button,

        small
        ? styles.small
        : styles.large,
      ]
    } onPress={onPress}>

    { loading 
    ? <ActivityIndicator color={ layout == layoutTypes.filled ? theme.COLORS.WHITE : theme.COLORS.PRIMARY } />
    :
    <Text style={[
        layout == layoutTypes.filled 
        ? styles.filledText
        : styles.text
    ]
    }>{title}</Text>
    }
    
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {marginBottom:30},
  button: {
    padding: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.COLORS.PRIMARY,
  },
  filledButton: {
    padding: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: theme.COLORS.PRIMARY,
  },
  text: {
    alignSelf: "center",
    color: theme.COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: "600",
  },
  filledText: {
    alignSelf: "center",
    color: theme.COLORS.WHITE,
    fontSize: 18,
    fontWeight: "600",
  },
  large:{
    width: theme.SIZES.MAX_WIDTH,
  },
  small:{
    width: ( theme.SIZES.MAX_WIDTH / 2 ) - 10,
  }
});
