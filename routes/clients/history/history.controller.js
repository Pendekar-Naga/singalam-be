const { db } = require('../../../database/db');

const databaseName = process.env.DB_NAME;

/**
 * Get reports for the currently logged in user
 */
const getUserReports = async (req, res) => {
  try {
    // Ambil user_id dari session
    const user_id = req.session.user_id;

    // Validasi apakah user sudah login
    if (!user_id) {
      return res.status(401).json({
        status: { code: 401, message: 'Unauthorized: Please login first' },
        data: null,
      });
    }

    // Query untuk mengambil data laporan sesuai user_id
    const [reports] = await db.promise().query(
      `SELECT r.*, k.name as kedinasan_name 
       FROM ${databaseName}.reports r
       LEFT JOIN ${databaseName}.kedinasan k ON r.kedinasan_id = k.kedinasan_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [user_id]
    );

    return res.status(200).json({
      status: { code: 200, message: 'User reports fetched successfully' },
      data: reports,
    });
  } catch (error) {
    console.error('Error in getUserReports:', error);
    return res.status(500).json({
      status: { code: 500, message: 'An unexpected error occurred' },
      error: error.message,
    });
  }
};

/**
 * Get all reports (for admin)
 */
const getAllReports = async (req, res) => {
  try {
    // Cek apakah user adalah admin (asumsi role disimpan di session)
    const userRole = req.session.role;

    if (userRole !== 'admin') {
      return res.status(403).json({
        status: { code: 403, message: 'Forbidden: Admin access required' },
        data: null,
      });
    }

    const [reports] = await db.promise().query(
      `SELECT r.*, k.name as kedinasan_name, u.username 
       FROM ${databaseName}.reports r
       LEFT JOIN ${databaseName}.kedinasan k ON r.kedinasan_id = k.kedinasan_id
       LEFT JOIN ${databaseName}.users u ON r.user_id = u.user_id
       ORDER BY r.created_at DESC`
    );

    return res.status(200).json({
      status: { code: 200, message: 'All reports fetched successfully' },
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

/**
 * Get report detail by ID (only if owned by current user or admin)
 */
const getReportByID = async (req, res) => {
  const { id } = req.params;
  const user_id = req.session.user_id;
  const userRole = req.session.role;

  try {
    // Query untuk mengambil laporan berdasarkan ID
    const [report] = await db.promise().query(
      `SELECT r.*, k.name as kedinasan_name, u.username 
       FROM ${databaseName}.reports r
       LEFT JOIN ${databaseName}.kedinasan k ON r.kedinasan_id = k.kedinasan_id
       LEFT JOIN ${databaseName}.users u ON r.user_id = u.user_id
       WHERE r.report_id = ?`,
      [id]
    );

    if (!report.length) {
      return res.status(404).json({
        status: { code: 404, message: 'Report not found' },
        data: null,
      });
    }

    // Validasi kepemilikan laporan (hanya owner atau admin yang bisa akses)
    if (report[0].user_id !== user_id && userRole !== 'admin') {
      return res.status(403).json({
        status: { code: 403, message: 'Forbidden: You do not have permission to access this report' },
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
  getUserReports,
  getAllReports,
  getReportByID,
};
