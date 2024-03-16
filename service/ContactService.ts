import axios from "axios";

import { Contact, Item } from "../interface";
import API_URL_ENV from "../app/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = API_URL_ENV + `/Contract`;
const initialContacts: Contact[] = [
  {
    id: "231",
    date: "20/10/2019",
    title: "Ghế tình yêu",
    description: "Làm ghế lung linh",
    value: 1000,
    pay: 500,
    status: 1,
  },
  {
    id: "2312",
    date: "20/10/2019",
    title: "Ghế tình yêu",
    description: "Làm ghế lung linh",
    value: 1000,
    pay: 500,
    status: 2,
  },
  {
    id: "2331",
    date: "20/10/2019",
    title: "Ghế tình yêu",
    description: "Làm ghế lung linh",
    value: 1000,
    pay: 500,
    status: 3,
  },
];
const contact: Contact = {
  id: "2331",
  date: "20/10/2019",
  title: "Ghế tình yêu",
  description: "Làm ghế lung linh",
  value: 1000,
  pay: 500,
  status: 1,
};
const initialItems: Item[] = [
  {
    id: "33",
    image:
      "https://i.pinimg.com/originals/bf/44/f0/bf44f0dce9873f824d00bfb9617f97b4.jpg",
    name: "Loli 1",
    price: 200,
    quantity: 3,
  },
  {
    id: "4",
    image:
      "https://i.pinimg.com/originals/bf/44/f0/bf44f0dce9873f824d00bfb9617f97b4.jpg",
    name: "Loli 2",
    price: 200,
    quantity: 3,
  },
  {
    id: "93",
    image:
      "https://i.pinimg.com/originals/bf/44/f0/bf44f0dce9873f824d00bfb9617f97b4.jpg",
    name: "Loli 3",
    price: 200,
    quantity: 3,
  },
];

class ContactService {
  static async getContactsByPage(currentPage: number) {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await axios.get(
        `${API_URL}/GetContractsByLoginCustomer?pageIndex=${currentPage}&pageSize=10`
      );
      if (response.data.isSuccess === true) {
        response.data.data.items.map((item) => {
          item.id = item.contractID;
          item.status = item.statusContract;
        });
        return response.data.data;
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  }

  static async getTotalPages() {
    return 40;
    try {
      const response = await axios.get(`${API_URL}/Contacts/total-pages`, {});
      if (response.data.success === true) {
        return response.data.data;
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  }
  static async updateStatus(idContact, newStatus) {
    return;
  }
  static async getContactById(idContact) {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await axios.get(
        `${API_URL}/GetContractItem?contractId=${idContact}`
      );
      if (response.data.isSuccess === true) {
        response.data.data.status = response.data.data.statusContract;
        response.data.data.item.map((item) => {
          item.id = item.productId;
          item.name = item.productName;
        });
        return response.data.data;
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      // toast.error("Something went wrong");
    }
  }
  static async getItemContact(idContact) {
    return initialItems;
  }
}

export { ContactService as default };
