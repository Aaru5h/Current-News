const marketService = require('../services/market.service');

const getUSMacro = async (req, res) => {
  try {
    // Example: UNRATE is the FRED code for Unemployment Rate
    const data = await marketService.getFredData('UNRATE');
    res.status(200).json({
      success: true,
      source: 'FRED',
      indicator: 'Unemployment Rate',
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCompanyData = async (req, res) => {
  try {
    const { cik } = req.params;
    const data = await marketService.getSecFilings(cik);
    res.status(200).json({ success: true, source: 'SEC', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUSMacro,
  getCompanyData
};
