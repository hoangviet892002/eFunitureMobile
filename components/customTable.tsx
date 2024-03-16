import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusGraph } from "../helper";
import CustomDropdown from "./customDropdown";

interface Column {
  id: string;
  label: string;
  type: string;
  formatter?: (value: any) => string;
}

interface CustomTableProps {
  columns: Column[];
  data: any[];
  statusGraph?: StatusGraph;
  onUpdateStatus?: (id: number, newStatus: number) => void;
  statusMapping?: { [key: number]: string };
  viewDetail?: (item: string) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  statusGraph,
  onUpdateStatus,
  statusMapping,
  viewDetail,
}) => {
  const renderItem = ({ item }) => {
    const nextStatusOptions = statusGraph
      ? statusGraph
          .getNextStates(item.status)
          .map((status) => statusMapping?.[status])
      : [];

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => viewDetail && viewDetail(item.id)}
      >
        {columns.map((column) => {
          switch (column.type) {
            case "text":
              return (
                <Text key={column.id} style={styles.text}>
                  {column.formatter
                    ? column.formatter(item[column.id])
                    : item[column.id]}
                </Text>
              );

            case "select":
              if (!statusMapping) return null;
              return (
                <View style={styles.text} key={column.id}>
                  <CustomDropdown
                    currentValue={statusMapping[item[column.id]]}
                    options={nextStatusOptions}
                    onSelect={(selectedValue) => {
                      const newStatus = parseInt(
                        Object.keys(statusMapping).find(
                          (key) => statusMapping[key] === selectedValue
                        ) || "0",
                        10
                      );
                      if (onUpdateStatus) {
                        onUpdateStatus(item.id, newStatus);
                      }
                    }}
                  />
                </View>
              );
            case "image":
              return (
                <View style={styles.text} key={column.id}>
                  <View style={styles.imageContainer} key={column.id}>
                    <Image
                      source={{ uri: item[column.id] }}
                      style={styles.productImage}
                    />
                  </View>
                </View>
              );
            default:
              return null;
          }
        })}
      </TouchableOpacity>
    );
  };
  const renderHeader = () => (
    <View style={styles.headerRow}>
      {columns.map((column) => (
        <Text key={column.id} style={styles.headerText}>
          {column.label}
        </Text>
      ))}
    </View>
  );

  return (
    <View>
      {renderHeader()}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "left",
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  text: {
    fontSize: 16,
    flex: 1,
    textAlign: "left",
    marginLeft: 10,
  },
  imageContainer: {
    borderRadius: 25,
    overflow: "hidden",
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
});

export default CustomTable;
