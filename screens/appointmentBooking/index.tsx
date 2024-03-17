// AppointmentBookingPage.js
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Button } from "react-native";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import UserInfoForm from "./UserInfoForm";
import Toast from "react-native-toast-message";
import Axios from "axios";
import { AppointmentService } from "../../service";

const AppointmentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !fullName || !contactNumber) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Fill information.",
      });
      return;
    }

    AppointmentService.createAppointment(
      selectedDate.toISOString(),
      selectedTime,
      fullName,
      contactNumber,
      email
    );
  };

  return (
    <ScrollView style={styles.container}>
      <DateSelector
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <TimeSelector
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
      />
      <UserInfoForm
        fullName={fullName}
        setFullName={setFullName}
        contactNumber={contactNumber}
        setContactNumber={setContactNumber}
        email={email}
        setEmail={setEmail}
      />
      <View style={styles.buttonContainer}>
        <Button title="Submit Appointment" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    margin: 20,
  },
});

export default AppointmentBookingPage;
