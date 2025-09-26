/* eslint-disable no-useless-catch */
import { axiosInstance } from "./axiosInstance";

class Batch {
  static async getAllBatches() {
    try {
      const response = await axiosInstance.get("/batches");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Batch;
