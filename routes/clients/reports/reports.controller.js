const { db } = require('../../../database/db');
const crypto = require('crypto');

const databaseName = process.env.DB_NAME;

const createReport = async (req, res) => {
  const { description, kedinasan_id, user_id } = req.body;

  if (!description || !kedinasan_id || !user_id) {
    return res.status(400).json({
      status: { code: 400, message: 'All fields are required' },
      data: null,
    });
  }

  try {
    const report_id = crypto.randomUUID();

    db.query(
      `INSERT INTO reports (report_id, description, status, kedinasan_id, user_id) 
         VALUES (?, ?, ?, ?, ?)`,
      [report_id, description, 'pending', kedinasan_id, user_id]
    );

    const reportData = {
      report_id,
      description,
      kedinasan_id,
      user_id,
    };

    return res.status(201).json({
      status: { code: 201, message: 'Report created successfully' },
      data: reportData,
    });
  } catch (error) {
    console.error('Error in createReport:', error);
    return res.status(500).json({
      status: { code: 500, message: 'Failed to create report' },
      error: error.message,
    });
  }
};

const getAllReports = async (req, res) => {
  try {
    const [reports] = await db.promise().query(`SELECT * FROM reports`);

    return res.status(200).json({
      status: { code: 200, message: 'Reports fetched successfully' },
      data: reports,
    });
  } catch (error) {
    console.error('Error in getAllReports:', error);
    return res.status(500).json({
      status: { code: 500, message: 'An unexpected error occurred' },
      error: error.message,
    });
  }
};

const getReportByID = async (req, res) => {
  const { id } = req.params;

  try {
    const [report] = await db.query(`SELECT * FROM ${databaseName}.reports WHERE report_id = ?`, [id]);

    if (!report.length) {
      return res.status(404).json({
        status: { code: 404, message: 'Report not found' },
        data: null,
      });
    }

    return res.status(200).json({
      status: { code: 200, message: 'Report fetched successfully' },
      data: report[0],
    });
  } catch (error) {
    console.error('Error in getReportByID:', error);
    return res.status(500).json({
      status: { code: 500, message: 'An unexpected error occurred' },
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportByID,
};
