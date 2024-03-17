import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { CustomPagination, CustomTable } from "../../components";
import { Transaction } from "../../interface";
import { TransactionService } from "../../service";

import DateTimePicker from "@react-native-community/datetimepicker";

const TransactionPages = ({ navigation }) => {
  const columns = [
    { id: "from", label: "From", type: "text" },
    { id: "to", label: "To", type: "text" },
    { id: "amount", label: "Value", type: "text" },
    {
      id: "creationDate",
      label: "Date",
      type: "text",
      formatter: (value) => formatDate(value),
    },
    { id: "balanceRemain", label: "Balance", type: "text" },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };
  const formatDate = (dateIn: string) => {
    var date = new Date(dateIn);
    function pad(number) {
      if (number < 10) {
        return "0" + number;
      }
      return number;
    }
    var formattedDate =
      date.getFullYear() +
      "/" +
      pad(date.getMonth() + 1) +
      "/" +
      pad(date.getDate());
    return formattedDate;
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const fetchData = async () => {
    const response = await TransactionService.getTransactionsByPage(
      currentPage,
      startDate.toISOString(),
      endDate.toISOString()
    );
    setData(response.items);
    setTotalPages(response.totalPagesCount);
  };
  const viewDetail = (id) => {
    navigation.navigate("TransactionDetail", { itemId: id });
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, startDate, endDate]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text>Start Date: {startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onChangeStartDate}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowEndDatePicker(true)}
        style={{ marginTop: 20 }}
      >
        <Text>End Date: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onChangeEndDate}
        />
      )}
      <CustomTable columns={columns} data={data} viewDetail={viewDetail} />
      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});

export default TransactionPages;
