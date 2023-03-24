import { StatusBar } from "expo-status-bar";
import StackNavigator from "./StackNavigator";

export default function App() {
  return (
    <>
      <StackNavigator />
      <StatusBar style="auto" />
    </>
  );
};
