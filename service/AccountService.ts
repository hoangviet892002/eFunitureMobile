import axios from "axios";

import { Account } from "../interface";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL_ENV from "../app/config/api";

const API_URL = API_URL_ENV + `/User`;

const account: Account = {
  id: "",
  name: "",
  email: "",
  password: "",
  address: "",
  wallet: 0,
  roles: "",
  dateOfBird: "",
  gender: "",
  phoneNumber: "",
  lockoutEnd: "",
};

class AccountService {
  static async getAccounts() {
    const accessToken = await AsyncStorage.getItem("accessToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    try {
      const response = await axios.get(
        `${API_URL}/GetUserInformationByLogin`,
        {}
      );
      if (response.data.isSuccess === true) {
        return response.data.data;
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
    return null;
  }
  static async updateAccount(data: any) {
    const accessToken = await AsyncStorage.getItem("accessToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    try {
      const response = await axios.post(`${API_URL}/UpdateUser`, data);
      if (response.data.isSuccess === true) {
        Toast.show({
          type: "success",
          text1: response.data.message,
        });
        return response.data.data;
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  }
  static async changePassword(data: any) {
    const accessToken = await AsyncStorage.getItem("accessToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    try {
      const response = await axios.post(`${API_URL}/ChangePassword`, data);
      if (response.data.isSuccess === true) {
        Toast.show({
          type: "success",
          text1: response.data.message,
        });
        return response.data.data;
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  }
}

export { AccountService as default };
