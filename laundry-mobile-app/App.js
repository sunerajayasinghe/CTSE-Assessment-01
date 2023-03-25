import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import StackNavigator from "./StackNavigator";
import store from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <StackNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
};
