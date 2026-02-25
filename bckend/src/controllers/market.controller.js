import {
  fetchUSMacroData,
  fetchStockQuote,
  fetchSECData
} from "../services/market.services.js";

export const getUSMacroData = async (req, res) => {
  try{
    const data = await fetchUSMacroData();
    await res.json(data);
  } catch (error) {
    await res.status(500).json({ error: error.message });
  }
};

export const getStockQuote = async (req, res) => {
  try{
    const { symbol } = req.params;
    const data = await fetchStockQuote(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSECFilings = async (req, res) =>{
  try{
    const { cik } = req.params;
    const data = await fetchSECData(cik);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};
