import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import { DynamicForm, UpdateObject } from "../../components";
import { Account } from "../../interface";
import { AccountService, AuthService } from "../../service";

const initialData: Account = {
  id: "",
  name: "",
  email: "",
  password: "",
  address: "",
  wallet: 0,
  roles: "",
  dateOfBird: "",
  gender: "",
  phoneNumber: "",
  lockoutEnd: "",
};
interface FormFieldDefinition {
  type: "text" | "date" | "picker" | "password";
  key: string;
  label: string;
  value: string | Date;
  options?: { label: string; value: string }[];
}
const SettingAccount = () => {
  const formFields: FormFieldDefinition[] = [
    { type: "password", key: "oldPassword", label: "Mật khẩu cũ", value: "" },
    { type: "password", key: "newPassword", label: "Mật khẩu mới", value: "" },
    {
      type: "password",
      key: "confirmPassword",
      label: "Xác nhận mật khẩu mới",
      value: "",
    },
  ];
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleFormChange = (key: string, value: string | Date) => {
    setFormData({ ...formData, [key]: value });
  };
  const handleChangePass = async () => {
    setIsLoading(true);
    const response = await AccountService.changePassword(formData);
    setIsLoading(false);
  };
  const fields = [
    { key: "name", label: "Name", type: "text" },
    { key: "dateOfBird", label: "Date of Birth", type: "date" },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "orther" },
      ],
    },
    { key: "address", label: "Address", type: "text" },
    { key: "phoneNumber", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
  ];

  const [data, setData] = useState<Account>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await AccountService.getAccounts();
    setData(response);
    setIsLoading(false);
  };
  const handleUpdate = (updatedData) => {
    setIsLoading(true);
    AccountService.updateAccount(updatedData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <UpdateObject
        fields={fields}
        initialData={data}
        onUpdate={handleUpdate}
      />
      <DynamicForm
        formFields={formFields.map((field) => ({
          ...field,
          value: formData[field.key],
        }))}
        onChange={handleFormChange}
      />
      <Button title="Change Pass" onPress={handleChangePass} color="#007bff" />
    </View>
  );
};

export default SettingAccount;
