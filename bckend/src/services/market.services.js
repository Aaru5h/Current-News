const axios = require('axios');

// SEC requires a specific User-Agent header (Company Name/Contact Email)
const SEC_HEADERS = { 'User-Agent': process.env.SEC_USER_AGENT };

const getFredData = async (seriesId) => {
  const url = `https://api.stlouisfed.org/fred/series/observations`;
  const response = await axios.get(url, {
    params: {
      series_id: seriesId,
      api_key: process.env.FRED_API_KEY,
      file_type: 'json',
      sort_order: 'desc',
      limit: 10
    }
  });
  return response.data.observations;
};

const getSecFilings = async (cik) => {
  // Example for SEC company facts
  const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik.padStart(10, '0')}.json`;
  const response = await axios.get(url, { headers: SEC_HEADERS });
  return response.data;
};

module.exports = {
  getFredData,
  getSecFilings
};
