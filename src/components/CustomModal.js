import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import theme from "../theme";
import Button from "./Button";

export default ({ visible, children, title, onCancel, onSave, onSecondaryPress, animation, loading, saveText="SAVE", secondaryText }) => {
  return (
    <>
      <Modal visible={visible} animationType={animation ? "slide" : "fade"} transparent={true} statusBarTranslucent={true} onRequestClose={visible}>
        <TouchableOpacity style={styles.modalCenteredView} activeOpacity={1} onPressOut={onCancel}>
        <KeyboardAvoidingView enabled behavior={Platform.OS === "android" ? "padding" : "position"}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>{title}</Text>
                <View style={styles.divider} />
                  {children}
                <View style={styles.modalButton}>
                  {secondaryText
                  ? 
                   <View style={{ flexDirection: "row", justifyContent:'space-between' }} >
                      <Button loading={loading} title={secondaryText} layout={"filled"} onPress={onSecondaryPress} small={true} color={"red"} />
                      <Button loading={loading} title={saveText} layout={"filled"} onPress={onSave} small={true}/>
                   </View>
                  :
                  <Button loading={loading} title={saveText} layout={"filled"} onPress={onSave} />
                }
                  
                </View>
            </View>
          </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

//Screen Style
const styles = StyleSheet.create({
  modalCenteredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  modalView: {
    backgroundColor: "white",
    justifyContent: 'flex-end',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
  },
  modalButton: {
    marginVertical:20,
  },
  button:{
    width: "100%",
    paddingVertical:13,
    backgroundColor:theme.COLORS.PRIMARY,
    borderRadius: 10,
  },
  buttonText: {
    color: theme.COLORS.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  divider:{
    borderWidth:0.3,
    backgroundColor:theme.COLORS.PRIMARY,
    width: Dimensions.get('window').width - 15,
    marginVertical: 10
  }
});