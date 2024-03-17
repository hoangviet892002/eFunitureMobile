import React, { useEffect, useState } from "react";
import { View, Text, Platform, Button, TouchableOpacity } from "react-native";
import {
  ObjectDetail,
  CustomDropdown,
  CustomTable,
  CustomPagination,
} from "../../components";
import { Order } from "../../interface";
import { StatusGraph } from "../../helper";
import { OrderService } from "../../service/";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const statusLabels: Record<number, string> = {
  1: "Pending",
  2: "To Ship",
  3: "Cancel",
  4: "Recieve",
  5: "Refuse to Confirm",
};
const statusGraph = new StatusGraph();

statusGraph.addEdge(1, 3);
const Orderpages = ({ navigation }) => {
  const columns = [
    { id: "address", label: "Address", type: "text" },
    { id: "phoneNumber", label: "Phone Number", type: "text" },
    { id: "price", label: "Price", type: "text" },
    { id: "status", label: "Status", type: "select" },
  ];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectStatus, setSelectStatus] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const fetchData = async () => {
    const totalPages = await OrderService.getTotalPages();
    setTotalPages(totalPages);
    const response = await OrderService.getOrders(
      currentPage,
      selectStatus,
      startDate.toISOString(),
      endDate.toISOString()
    );
    setData(response.items);
  };
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, selectStatus, startDate, endDate]);
  const onUpdateStatus = () => {};
  const viewDetail = (id) => {
    navigation.navigate("OrderDetail", { itemId: id });
  };

  return (
    <View>
      <Picker
        selectedValue={selectStatus}
        onValueChange={(itemValue, itemIndex) => setSelectStatus(itemValue)}
        style={{ height: 50, width: 150 }}
      >
        {Object.entries(statusLabels).map(([key, value]) => (
          <Picker.Item key={key} label={value} value={key} />
        ))}
      </Picker>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text>Ngày bắt đầu: {startDate.toDateString()}</Text>
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
        <Text>Ngày kết thúc: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onChangeEndDate}
        />
      )}
      <CustomTable
        columns={columns}
        data={data}
        statusGraph={statusGraph}
        onUpdateStatus={onUpdateStatus}
        statusMapping={statusLabels}
        viewDetail={viewDetail}
      />
      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </View>
  );
};
export default Orderpages;
