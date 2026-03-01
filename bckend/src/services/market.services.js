import axios from "axios"; 

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

// US Macro Data (GDP + Inflation)
export const fetchUSMacroData = async () => {
  const gdp = await axios.get(FRED_BASE, {
    params: {
      series_id: "GDP",
      api_key: process.env.FRED_API_KEY,
      file_type: "json"
    }
  });

  const inflation = await axios.get(FRED_BASE, {
    params: {
      series_id: "CPIAUCSL",
      api_key: process.env.FRED_API_KEY,
      file_type: "json"
    }
  });

  return {
    gdp: gdp.data.observations.slice(-5),
    inflation: inflation.data.observations.slice(-5)
  };
};

//Stock Quote (Using Yahoo Finance unofficial API)
export const fetchStockQuote = async (symbol) => {
  const response = await axios.get(
     `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
  );

  return response.data.quoteResponse.result[0];
};

//SEC EDGAR Filings 
export const fetchSECData = async (cik) => {
  // SEC requires CIK to be 10 digits padded with 0s
  const paddedCik = cik.toString().padStart(10, '0');
  const response = await axios.get(
   `https://data.sec.gov/submissions/CIK${paddedCik}.json`,
    {
      headers: {
        "User-Agent": "Current-News-App (your_email@example.com)"
      }
    }
  );

  return response.data.filings.recent;
};
