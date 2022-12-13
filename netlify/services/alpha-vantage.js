import axios from "axios";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const AlphaVantageAPI = axios.create({
  baseURL: process.env.ALPHA_VANTAGE_API_URL
});

export default class AlphaVantage {
  static async getQuote(ticker) {
    return await AlphaVantageAPI.get(`?function=GLOBAL_QUOTE&symbol=${ticker}.SA&apikey=${ALPHA_VANTAGE_API_KEY}`)
  }
}
