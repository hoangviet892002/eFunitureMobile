import axios from "axios";

const API_URL = "https://momosv3.apimienphi.com/api";

class ThirdService {
  static async getQR(note: string) {
    try {
      const response = await axios.get(
        `${API_URL}/QRCode?phone=0931275909&amount=2000&note=NoiDungGiaoDich`
      );
      return response;
      console.log(response);
      if (response.data.isSuccess === true) {
        return response.data;
      } else {
        // toast.error(response.data.message);
      }
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  }
}

export { ThirdService as default };
