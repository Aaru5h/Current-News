import { getFredData, getSecFilings } from '../services/market.services.js';

export const getUSMacro = async (req, res) => {
  try {
    const data = await getFredData('UNRATE');
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

export const getCompanyData = async (req, res) => {
  try {
    const { cik } = req.params;
    const data = await getSecFilings(cik);
    res.status(200).json({ success: true, source: 'SEC', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
