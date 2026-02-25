import {
  fetchUSMacroData,
  fetchStockQuote,
  fetchSECData
} from "../services/market.services.js";

export const getUSMacroData = async (req, res) => {
  try{
    const data = await fetchUSMacroData();
    res.jsom(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStockQuote = async (req, res) => {
  try{
    cost { symbol } -req.paramas;
    const data = await fetStockQuote(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSECFilings = async (req, res) =>{
  try{
    const { cik } = req.paramas;
    const data = await fetchSECData(cik);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};
