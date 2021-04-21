import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";

//Redux
import { Provider } from "react-redux";
import store from "./src/redux/Store";

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Provider>
  );
}
