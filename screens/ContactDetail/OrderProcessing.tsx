import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { CustomTable } from "../../components";
import { Item, Order } from "../../interface";
import { OrderService } from "../../service";
const initalOrder: Order = {
  address: "?",
  amount: 0,
  id: "",
  pay: 0,
  status: 0,
};
interface Props {
  idContact: string;
}
const OrderProcessScreen: React.FC<Props> = ({ idContact }) => {
  const navigation = useNavigation();
  const columnsItem = [
    { id: "image", label: "Image", type: "image" },
    { id: "name", label: "Product name", type: "text" },
    { id: "price", label: "Price", type: "text" },
    { id: "quantity", label: "Quantity", type: "text" },
  ];

  const [dataItem, setDataItem] = useState<Item[]>([]);

  const fetchData = async () => {
    const response = await OrderService.getItemOrder(idContact);
    setDataItem(response);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <CustomTable columns={columnsItem} data={dataItem} />
    </View>
  );
};

export default OrderProcessScreen;
