import axios from "axios";

const DB_BASE_URL = process.env.DB_SERVICE;
const DB_KEY = process.env.DB_KEY;

export const getLogsForTransactionId = async (transactionId: string) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${DB_BASE_URL}payload/logs/${transactionId}`,
    headers: {
      "x-api-key": DB_KEY,
    },
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
