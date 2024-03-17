import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { CustomTable, CustomPagination } from "../../components";
import { StatusGraph } from "../../helper";
import { Appointment } from "../../interface";
import { AppointmentService } from "../../service";
import { useFocusEffect } from "@react-navigation/native";

const statusMapping = {
  1: "Pending",
  2: "Waiting",
  3: "Completed",
  4: "Cancelled",
};

const statusGraph = new StatusGraph();
statusGraph.addEdge(2, 4);
statusGraph.addEdge(1, 4);

const App = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const columns = [
    { id: "staffName", label: "Staff name ", type: "text" },
    { id: "date", label: "Date", type: "text" },
    { id: "status", label: "Status", type: "select" },
  ];
  const [data, setData] = useState<Appointment[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [load, setLoad] = useState<boolean>(false);

  const fetchData = async () => {
    const response = await AppointmentService.getAppointmentsByPage(
      currentPage
    );
    setData(response.items);
    setTotalPages(response.totalPagesCount);
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, load]);

  const onUpdateStatus = async (id, newStatus) => {
    await AppointmentService.updateAppointmentStatus(id, newStatus);
    fetchData();
    setLoad(!load);
  };
  const viewDetail = (id) => {
    navigation.navigate("AppointmentDetail", { itemId: id });
  };

  return (
    <View style={styles.container}>
      <CustomTable
        columns={columns}
        data={data}
        statusGraph={statusGraph}
        onUpdateStatus={onUpdateStatus}
        statusMapping={statusMapping}
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

export default App;
