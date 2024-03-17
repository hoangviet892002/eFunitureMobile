import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Item, Order, Status } from "../../interface";
import { OrderService, TransactionService } from "../../service";
import { CustomTable, ObjectDetail } from "../../components";

const initalTransaction = {
  type: "?",
  from: "?",
  to: "?",
  amount: "?",
  balanceRemain: "?",
  description: "?",
};
const TransactionDetailScreen = ({ route }) => {
  const { itemId } = route.params;
  const transFields = [
    { key: "type", label: "Typeh", type: "text" },
    { key: "from", label: "From", type: "text" },
    {
      key: "to",
      label: "To",
      type: "text",
    },
    { key: "amount", label: "Value", type: "text" },
    { key: "balanceRemain", label: "Balance", type: "text" },
    { key: "description", label: "Comment", type: "text" },
  ];
  const [transaction, setTransaction] = useState(initalTransaction);
  const fetchtTransaction = async () => {
    const response = await TransactionService.getTransactionById(itemId);
    setTransaction(response);
  };
  useEffect(() => {
    fetchtTransaction();
  }, []);
  return (
    <View>
      <ObjectDetail fields={transFields} data={transaction} />
    </View>
  );
};

export default TransactionDetailScreen;
