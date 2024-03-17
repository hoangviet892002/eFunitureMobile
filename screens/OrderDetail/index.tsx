import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Item, Order, Status } from "../../interface";
import { OrderService } from "../../service";
import { CustomTable, ObjectDetail } from "../../components";
const initalOrder: Order = {
  address: "?",
  amount: 0,
  id: "",
  pay: 0,
  status: 0,
};
const OrderDetailScreen = ({ route }) => {
  const { itemId } = route.params;

  const columnsItem = [
    { id: "image", label: "Image", type: "image" },
    { id: "name", label: "Product name", type: "text" },

    { id: "price", label: "Price", type: "text" },
    { id: "quantity", label: "Quantity", type: "text" },
  ];
  const OrderFields = [
    { key: "address", label: "Address", type: "text" },
    { key: "price", label: "Total Value", type: "text" },
    {
      key: "status",
      label: "Status",
      type: "text",
      formatter: (value) => statusMapping[value],
    },
    { key: "phoneNumber", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "name", label: "Name", type: "text" },
  ];
  const statusMapping = {
    1: "Pending",
    2: "To Ship",
    3: "Cancel",
    4: "Recieve",
    5: "Refuse to Confirm",
  };
  const [dataItem, setDataItem] = useState([]);

  const [Order, setOrder] = useState(initalOrder);

  const fetchtOrder = async () => {
    const response = await OrderService.getOrder(itemId);
    setOrder(response);
  };

  const fetchData = async () => {
    const response = await OrderService.getItemOrder(itemId);
    setDataItem(response);
  };
  useEffect(() => {
    fetchtOrder();
    fetchData();
  }, []);

  return (
    <View>
      <ObjectDetail fields={OrderFields} data={Order} />
      <CustomTable columns={columnsItem} data={dataItem} />
    </View>
  );
};

export default OrderDetailScreen;
