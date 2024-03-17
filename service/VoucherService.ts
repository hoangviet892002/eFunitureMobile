import axios from "axios";

import { Voucher } from "../interface";
import API_URL_ENV from "../app/config/api";

const API_URL = API_URL_ENV + `/Voucher`;
const initialVouchers: Voucher[] = [
  {
    id: "33",
    name: "Voucher A",
    endDate: "21321",
    maxUse: 6,
    percent: 20,
    startDate: "12121",
  },
  {
    id: "2",
    name: "Voucher B",
    endDate: "21321",
    maxUse: 6,
    percent: 20,
    startDate: "12121",
  },
  {
    id: "6",
    name: "Voucher C",
    endDate: "21321",
    maxUse: 6,
    percent: 20,
    startDate: "12121",
  },
];

const voucher: Voucher = {
  id: "6",
  name: "Voucher C",
  endDate: "21321",
  maxUse: 6,
  percent: 20,
  startDate: "12121",
};

class VoucherService {
  static async getVouchersByPage(currentPage: number) {
    try {
      const response = await axios.get(
        `${API_URL}/GetVoucherByLogin?pageIndex=${currentPage}&pageSize=10`
      );
      if (response.data.isSuccess === true) {
        response.data.data.items.map((item) => {
          item.name = item.voucherName;
        });
        return response.data.data;
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  }

  static async getTotalPages() {
    return 40;
    try {
      const response = await axios.get(`${API_URL}/Vouchers/total-pages`, {});
      if (response.data.success === true) {
        return response.data.data;
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  }

  static async getVoucherById(VoucherId: string) {
    return voucher;
    try {
      const response = await axios.get(`${API_URL}/Vouchers/${VoucherId}`);
      if (response.data.success !== true) {
        return response.data.data;
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  }
}

export { VoucherService as default };
