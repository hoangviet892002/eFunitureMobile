import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import ProfileHeader from "./ProfileHeader";
import HorizontalMenu from "./HorizontalMenu";
import VerticalMenu from "./VerticalMenu";
import { AccountService } from "../../service";

const ProfileScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    wallet: 0,
  });
  const fetchData = async () => {
    setIsLoading(true);
    const response = await AccountService.getAccounts();
    setData(response);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.screen}>
      <ProfileHeader userName={data.name} accountBalance={data.wallet} />
      <HorizontalMenu />
      <VerticalMenu navigate={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default ProfileScreen;
