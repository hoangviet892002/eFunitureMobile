import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import { AccountService } from "../../service";

const TopupScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ userName: "" });

  const fetchData = async () => {
    setIsLoading(true);
    const response = await AccountService.getAccounts();
    console.log(response);
    setData(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    alert("Copy: " + text);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `https://momosv3.apimienphi.com/api/QRCode?phone=0911413402&amount=0&note=${data.userName}`,
        }}
        style={styles.image}
      />
      <TouchableOpacity onPress={() => copyToClipboard("0911413402")}>
        <Text style={styles.text}>SDT nạp: 0911413402</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => copyToClipboard(data.userName)}>
        <Text style={styles.text}>Nội dung chuyển khoản: {data.userName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10, // Thêm padding cho container
  },
  image: {
    height: 680,
    borderRadius: 5,
  },
  text: {
    marginTop: 10, // Thêm khoảng cách giữa các Text
    padding: 10, // Thêm padding cho Text
    backgroundColor: "#E8E8E8", // Màu nền cho Text, tạo hiệu ứng nút bấm
    borderRadius: 5, // Bo tròn góc
  },
});

export default TopupScreen;
