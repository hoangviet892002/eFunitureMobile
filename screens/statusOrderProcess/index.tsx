import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { CustomTable, ObjectDetail } from "../../components";
import { Order, Status } from "../../interface";
import { OrderProcessingService } from "../../service";
const initalOrder: Order = {
  address: "?",
  amount: 0,
  id: "",
  pay: 0,
  status: 0,
};
const StatusOrderProcessingScreen = ({ route }) => {
  const { itemId } = route.params;

  const OrderFields = [
    { key: "name", label: "Product", type: "text" },
    {
      key: "price",
      label: "Price",
      type: "text",
    },
    { key: "quantity", label: "Quantity", type: "text" },
    { key: "image", label: "Image", type: "image" },
  ];
  const statusMapping = {
    1: "Pending",
    2: "Waiting",
    3: "Completed",
    4: "Cancelled",
  };
  const StatusColumns = [
    { id: "date", label: "Date", type: "text" },
    {
      id: "status",
      label: "Status",
      type: "text",
      formatter: (value: number) => statusMapping[value],
    },
  ];

  const [orderStatus, setOrderStatus] = useState<Status[]>([]);
  const [Order, setOrder] = useState<Order>(initalOrder);
  const fetchStatus = async () => {
    const response = await OrderProcessingService.getOrderStatus(itemId);
    setOrderStatus(response);
  };
  const fetchtOrder = async () => {
    const response = await OrderProcessingService.getOrderProcessing(itemId);
    setOrder(response);
  };

  useEffect(() => {
    fetchStatus();
    fetchtOrder();
  }, []);

  return (
    <View>
      <ObjectDetail fields={OrderFields} data={Order} />
      <CustomTable columns={StatusColumns} data={orderStatus} />
    </View>
  );
};

export default StatusOrderProcessingScreen;
