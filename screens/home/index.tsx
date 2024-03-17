import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Button,
} from "react-native";
import { CustomPagination } from "../../components";
import FilterSearchBar from "./FilterSearchBar";
import FurnitureItem from "./FurnitureItem";
import { AuthService, CategoryService, ProductService } from "../../service";
import { Category, Product } from "../../interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const priceOptions = [
    { label: "All prices", min: "0", max: "1000000000" },
    { label: "100 - 200", min: "100", max: "200" },
    { label: "200 - 300", min: "200", max: "300" },
  ];
  const [user, setUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [product, setProduct] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [typeMapping, setTypeMapping] = useState<Record<string, string>>({});
  const [selectedPrice, setSelectedPrice] = useState(priceOptions[0]);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        setUser(await AsyncStorage.getItem("user"));
      };
      setCurrentPage(1);
      fetchProducts();
      fetchCategories();
      fetch();
    }, [])
  );
  const fetchCategories = async () => {
    const response = await CategoryService.getCategories();
    setCategories(response);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const newTypeMapping = categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {} as Record<string, string>);
    setTypeMapping(newTypeMapping);
  }, [categories]);
  const fetchProducts = async () => {
    const products = await ProductService.getProductsByPage(
      currentPage,
      searchQuery,
      searchType,
      selectedPrice
    );
    setTotalPages(products.totalPagesCount);
    setProduct(products.items);
  };
  useEffect(() => {
    fetchProducts();
  }, [searchType, searchQuery, currentPage, selectedPrice]);

  const handleFilterChange = async (type, query, selectPrice) => {
    await setSearchType(type);
    await setSearchQuery(query);
    await setSelectedPrice(selectPrice);
    await setCurrentPage(1);
  };

  const handleItemPress = (id) => {
    navigation.navigate("ProductDetail", { itemId: id });
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <SafeAreaView style={styles.container}>
      {user == null ? (
        <>
          <Button
            title="Go to Login"
            onPress={() => navigation.navigate("Login")}
          />
        </>
      ) : (
        <>
          <Button
            title="Go to Appointment"
            onPress={() => navigation.navigate("Appointment")}
          />
          <Button
            title="Logout"
            onPress={() => {
              AuthService.logout();
              navigation.navigate("Login");
            }}
          />
        </>
      )}

      <FilterSearchBar
        onFilterChange={handleFilterChange}
        typeMapping={typeMapping}
      />
      <FlatList
        data={product}
        renderItem={({ item }) => (
          <FurnitureItem
            id={item.id}
            name={item.name}
            price={item.price}
            imageUri={item.image}
            onPress={() => handleItemPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
