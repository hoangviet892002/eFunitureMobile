import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "../../service";

const VerticalMenu = ({ navigate }) => {
  const navigation = useNavigation<any>();

  const menuItems = [
    {
      key: "SettingAccount",
      label: "Account Settings",
      iconName: "account-cog-outline",
    },
    {
      key: "Transactions",
      label: "Transaction",
      iconName: "cash-check",
    },
    {
      key: "TopUp",
      label: "Topup",
      iconName: "cash-plus",
    },
    { key: "logout", label: "Logout", iconName: "logout" },
  ];

  const handleMenuSelect = async (itemKey: string) => {
    if (itemKey === "logout") {
      await AuthService.logout();
      console.log(AsyncStorage.getItem("user"));
      navigation.navigate("Home");
    } else {
      navigation.navigate(itemKey);
    }
  };

  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.menuItem}
          onPress={() => handleMenuSelect(item.key)}
        >
          <Icon name={item.iconName} size={24} style={styles.icon} />
          <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {},
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    width: 24,
    textAlign: "center",
  },
});

export default VerticalMenu;
