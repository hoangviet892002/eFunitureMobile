import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AccountService } from "../../service";
import HorizontalMenu from "./HorizontalMenu";
import ProfileHeader from "./ProfileHeader";
import VerticalMenu from "./VerticalMenu";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
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
