import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
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
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "value", label: "Value", type: "text" },
    { key: "pay", label: "Deposit", type: "text" },
    { key: "phoneNumber", label: "Phone", type: "text" },
    { key: "email", label: "Mail", type: "text" },
    { key: "address", label: "Address", type: "text" },
  ];
  const [Contact, setContact] = useState(initalContact);
  const fetchContact = async () => {
    const response = await ContactService.getContactById(itemId);
    setContact(response);
    setDataItem(response.item);
  };
  const columnsItem = [
    { id: "image", label: "Image", type: "image" },
    { id: "name", label: "Product name", type: "text" },
    { id: "price", label: "Price", type: "text" },
    { id: "quantity", label: "Quantity", type: "text" },
  ];

  const [dataItem, setDataItem] = useState<Item[]>([]);

  const fetchData = async () => {
    const response = await OrderService.getItemOrder(itemId);
    setDataItem(response);
  };

  useEffect(() => {
    fetchContact();
  }, []);
  const onUpdateStatus = async (ContactID: string, newStatus: number) => {
    await ContactService.updateStatus(itemId, newStatus);
    fetchContact();
  };
  const nextStatusOptions = statusGraph
    .getNextStates(Contact.status)
    .map((status) => statusContactListing[status]);

  const handlePay = async () => {
    await ContactService.PayRemainingCostContractCustomer(itemId);
    fetchContact();
  };
  const renderHeader = () => {
    return (
      <View>
        <ObjectDetail fields={ContactFields} data={Contact} />

        <CustomTable columns={columnsItem} data={dataItem} />
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{Contact.statusOrderProcessing.name}</Text>
        </View>
        {Contact.statusOrderProcessing.statusCode === 3 && (
          <>
            <TouchableOpacity style={styles.loginButton} onPress={handlePay}>
              <Text style={styles.loginButtonText}>Pay Monet</Text>
            </TouchableOpacity>
          </>
        )}
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
  loginButton: {
    backgroundColor: "#0000ff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
export default ContactDetail;
