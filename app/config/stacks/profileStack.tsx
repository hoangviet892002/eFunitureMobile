import { useFocusEffect } from "@react-navigation/native";
import {
  Profile,
  ContactDetail,
  ContactList,
  OrderPages,
  VoucherList,
  SettingAccount,
  OrderDetailScreen,
  TransactionPages,
  StatusOrderProcessingScreen,
  Login,
  TransactionDetailScreen,
  TopupScreen,
} from "../../../screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const ProfileStackNavigator = ({ navigation }) => {
  const [user, setUser] = useState(null);
  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        setUser(storedUser);
      };
      fetch();
    }, [])
  );
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ title: "Profile" }}
          />
          <Stack.Screen
            name="Order"
            component={OrderPages}
            options={{ title: "Order" }}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ title: "Order Detail" }}
          />

          <Stack.Screen
            name="ContactDetail"
            component={ContactDetail}
            options={{ title: "ContactDetail" }}
          />
          <Stack.Screen
            name="ContactList"
            component={ContactList}
            options={{ title: "Contact list" }}
          />

          <Stack.Screen
            name="VoucherList"
            component={VoucherList}
            options={{ title: "Voucher List" }}
          />
          <Stack.Screen
            name="SettingAccount"
            component={SettingAccount}
            options={{ title: "Setting Account" }}
          />
          <Stack.Screen
            name="Transactions"
            component={TransactionPages}
            options={{ title: "Transaction Screen" }}
          />
          <Stack.Screen
            name="StatusOderProcessing"
            component={StatusOrderProcessingScreen}
            options={{ title: "Status" }}
          />
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetailScreen}
            options={{ title: "Transaction Detail" }}
          />
          <Stack.Screen
            name="TopUp"
            component={TopupScreen}
            options={{ title: "Topup" }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
      )}
    </Stack.Navigator>
  );
};
export default ProfileStackNavigator;
