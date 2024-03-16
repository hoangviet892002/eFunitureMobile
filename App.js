import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Routes from "./app/config/routers";

import { AuthService } from "./service";

const App = () => {
  useEffect(() => {
    const fetchToken = async () => {
      AuthService.reNewToken();
    };
    fetchToken();
  }, []);
  setInterval(async () => {
    await AuthService.reNewToken();
  }, 18000);
  return (
    <>
      <Routes />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
