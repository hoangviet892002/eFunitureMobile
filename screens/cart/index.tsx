import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomPagination } from "../../components";
import { Item, Voucher } from "../../interface";
import { AccountService, CartItemService, VoucherService } from "../../service";
import CartItemRender from "./CartItemRender";
import VoucherScreen from "./VoucherScreen";

const CartScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      fetchCartItem();
      fetchVoucher();
      fetchAccount();
    }, [])
  );
  const [cartData, setCartData] = useState<Item[]>([]);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [account, setAccount] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const fetchAccount = async () => {
    const reponese = await AccountService.getAccounts();
    setAccount(reponese);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddQuantity = async (itemId) => {
    await CartItemService.addQuantity(itemId);
    fetchCartItem();
  };
  const fetchVoucher = async () => {
    const response = await VoucherService.getVouchersByPage(currentPage);
    setVouchers(response.items);
    setTotalPages(response.totalPagesCount);
  };
  const fetchCartItem = async () => {
    const response = await CartItemService.getCartItem();
    setCartData(response);
  };
  useEffect(() => {
    fetchCartItem();
    fetchVoucher();
  }, [load]);
  const onSelectVoucher = (voucher) => {
    setSelectedVoucherId((currentSelectedVoucherId) => {
      if (currentSelectedVoucherId === voucher.id) {
        return null;
      } else {
        return voucher.id;
      }
    });
  };

  const handleReduceQuantity = async (itemId) => {
    await CartItemService.reduceQuantity(itemId);
    await setLoad(!load);
  };

  const handleRemoveItem = async (itemId) => {
    await CartItemService.deleteCartItem(itemId);
    await setLoad(!load);
  };

  const handleItemPress = (itemId) => {
    navigation.navigate("ProductDetail", { itemId: itemId });
  };

  const calculateTotal = () => {
    return cartData.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  };

  const calculateTotalDiscount = () => {
    let totalAfterDiscount = calculateTotal();

    if (selectedVoucherId) {
      const voucher = vouchers.find(
        (voucher) => voucher.id === selectedVoucherId
      );
      if (voucher) {
        totalAfterDiscount -= (totalAfterDiscount * voucher.percent) / 100;
      }
    }

    const totalDiscount = calculateTotal() - totalAfterDiscount;
    return totalDiscount;
  };

  const calculateTotalWithDiscounts = () => {
    const totalDiscount = calculateTotalDiscount();
    const totalAfterDiscounts = calculateTotal() - totalDiscount;
    return totalAfterDiscounts;
  };
  const checkoutButton = () => {
    setIsCheckoutModalVisible(true);
  };
  const checkout = async () => {
    await CartItemService.checkout(selectedVoucherId, account);
    setIsCheckoutModalVisible(!isCheckoutModalVisible);
    setLoad(!load);
  };

  useEffect(() => {
    fetchVoucher();
  }, [currentPage]);
  return (
    <View style={styles.container}>
      <FlatList
        data={cartData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRender
            item={item}
            onRemove={handleRemoveItem}
            onAddQuantity={handleAddQuantity}
            onReduceQuantity={handleReduceQuantity}
            onPress={() => handleItemPress(item.id)}
          />
        )}
      />
      <VoucherScreen
        vouchers={vouchers}
        selectedVoucherId={selectedVoucherId}
        onSelectVoucher={onSelectVoucher}
      />
      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <View style={styles.footer}>
        <Text style={styles.totalPriceText}>
          Total: ${calculateTotalWithDiscounts()}
        </Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={checkoutButton}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCheckoutModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={account.name}
              onChangeText={(text) => setAccount({ ...account, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={account.phoneNumber}
              onChangeText={(text) =>
                setAccount({ ...account, phoneNumber: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={account.email}
              onChangeText={(text) => setAccount({ ...account, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={account.address}
              onChangeText={(text) => setAccount({ ...account, address: text })}
            />

            <Button title="Submit" onPress={checkout} />
            <Button
              title="Close"
              onPress={() => setIsCheckoutModalVisible(!isCheckoutModalVisible)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f6f6f6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  quantityButton: {
    padding: 5,
    borderColor: "#ddd",
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  quantityText: {
    fontSize: 18,
    color: "#333",
  },
  quantity: {
    paddingHorizontal: 10,
    fontSize: 18,
    color: "#333",
  },
  removeButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#ff3b30",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalItemsText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});

export default CartScreen;
