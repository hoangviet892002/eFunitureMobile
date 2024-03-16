import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { CustomDropdown, CustomTable, ObjectDetail } from "../../components";
import { StatusGraph } from "../../helper";
import { Item } from "../../interface";
import { ContactService, OrderService } from "../../service";

const initalContact = {
  id: "",
  description: "",
  title: "",
  customerContractName: "",
  pay: 0,
  status: 0,
  value: 0,
  phoneNumber: "",
  email: "",
  address: "",
  statusOrderProcessing: {
    name: "string",
    statusCode: 0,
  },
};

const ContactDetail = ({ route }) => {
  const { itemId } = route.params;
  const statusContactListing = {
    1: "Pending",
    2: "Cancelled",
    3: "Accept",
    4: "Require again",
  };
  const statusGraph = new StatusGraph();
  statusGraph.addEdge(1, 2);
  statusGraph.addEdge(1, 3);
  statusGraph.addEdge(1, 4);
  const ContactFields = [
    { key: "customerContractName", label: "Name", type: "text" },
    { key: "title", label: "Tiêu đề", type: "text" },
    { key: "description", label: "Nội dung", type: "text" },
    { key: "value", label: "Giá trị", type: "text" },
    { key: "pay", label: "Trả trước", type: "text" },
    { key: "phoneNumber", label: "Phone", type: "text" },
    { key: "email", label: "Mail", type: "text" },
    { key: "address", label: "Địa chỉ", type: "text" },
  ];
  const [Contact, setContact] = useState(initalContact);
  const fetchContact = async () => {
    const response = await ContactService.getContactById(itemId);
    setContact(response);
    setDataItem(response.item);
  };
  const columnsItem = [
    { id: "image", label: "Ảnh", type: "image" },
    { id: "name", label: "Tên sản phẩm", type: "text" },
    { id: "price", label: "Giá trị", type: "text" },
    { id: "quantity", label: "Số lượng", type: "text" },
  ];

  const [dataItem, setDataItem] = useState<Item[]>([]);

  const fetchData = async () => {
    const response = await OrderService.getItemOrder(itemId);
    setDataItem(response);
  };

  useEffect(() => {
    fetchContact();
  }, []);
  const onUpdateStatus = (ContactID: string, newStatus: number) => {
    ContactService.updateStatus(ContactID, newStatus);
    fetchContact();
  };
  const nextStatusOptions = statusGraph
    .getNextStates(Contact.status)
    .map((status) => statusContactListing[status]);

  const renderHeader = () => {
    return (
      <View>
        <ObjectDetail fields={ContactFields} data={Contact} />
        <CustomDropdown
          key={Contact.id}
          currentValue={statusContactListing[Contact.status]}
          options={nextStatusOptions}
          onSelect={(selectedValue) => {
            const newStatus = parseInt(
              Object.keys(statusContactListing).find(
                (key) => statusContactListing[key] === selectedValue
              ) || "0",
              10
            );
            onUpdateStatus(Contact.id, newStatus);
          }}
        />
        <CustomTable columns={columnsItem} data={dataItem} />
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Trạng thái</Text>
          <Text style={styles.value}>{Contact.statusOrderProcessing.name}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={dataItem}
      renderItem={({ item }) => <></>}
      keyExtractor={(item) => item.id}
    />
  );
};
const styles = StyleSheet.create({
  fieldContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    color: "#333",
  },
});
export default ContactDetail;
