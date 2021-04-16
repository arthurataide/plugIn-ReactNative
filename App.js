import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";

//Redux
import { Provider } from "react-redux";
import store from "./src/redux/Store";

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
