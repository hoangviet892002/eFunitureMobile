import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { CustomTable, CustomPagination } from "../../components";
import { StatusGraph } from "../../helper";
import { Contact } from "../../interface";
import { ContactService } from "../../service";
import { Picker } from "@react-native-picker/picker";

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

const ContactList = ({ navigation }) => {
  const columns = [
    { id: "title", label: "Title ", type: "text" },
    { id: "value", label: "Value", type: "text" },
    { id: "pay", label: "Deposit", type: "text" },
    { id: "status", label: "Status", type: "select" },
  ];
  const [data, setData] = useState<Contact[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    const response = await ContactService.getContactsByPage(currentPage);
    setData(response.items);
    setTotalPages(response.totalPagesCount);
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const onUpdateStatus = async (id, newStatus) => {
    await ContactService.updateStatus(id, newStatus);
    fetchData();
  };
  const viewDetail = (id) => {
    navigation.navigate("ContactDetail", { itemId: id });
  };

  return (
    <View style={styles.container}>
      <CustomTable
        columns={columns}
        data={data}
        statusGraph={statusGraph}
        onUpdateStatus={onUpdateStatus}
        statusMapping={statusContactListing}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});

export default ContactList;
