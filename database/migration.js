require('dotenv').config();
const { db } = require('./db');

const dropTableQuery = `
    DROP TABLE IF EXISTS reports, chat_message, chat_session, kedinasan, users;
`;

const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        profile_photo_url VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

const createKedinasanTableQuery = `
    CREATE TABLE IF NOT EXISTS kedinasan (
        kedinasan_id INT AUTO_INCREMENT PRIMARY KEY,
        nama_dinas VARCHAR(255) NOT NULL
    );
`;

const createChatSessionTableQuery = `
    CREATE TABLE IF NOT EXISTS chat_session (
        session_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
`;

const createChatMessageTableQuery = `
    CREATE TABLE IF NOT EXISTS chat_message (
        message_id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_session(session_id) ON DELETE CASCADE
    );
`;

const createReportsTableQuery = `
    CREATE TABLE IF NOT EXISTS reports (
        report_id VARCHAR(40) PRIMARY KEY,
        description TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status VARCHAR(50),
        closed_at TIMESTAMP NULL DEFAULT NULL,
        kedinasan_id INT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (kedinasan_id) REFERENCES kedinasan(kedinasan_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
`;

const insertKedinasanQuery = `
    INSERT INTO kedinasan (nama_dinas) VALUES 
    ('Dinas Kesehatan'),
    ('Dinas Pendidikan'),
    ('Dinas Pekerjaan Umum'),
    ('Dinas Perhubungan'),
    ('Dinas Sosial'),
    ('Dinas Lingkungan Hidup'),
    ('Dinas Kependudukan dan Catatan Sipil'),
    ('Dinas Pertanian'),
    ('Dinas Pariwisata'),
    ('Dinas Kebudayaan');
`;

function runMigrationAndSeed() {
  // Menjalankan query untuk menghapus tabel
  db.query(dropTableQuery, (err, result) => {
    if (err) {
      console.error('Failed to drop the tables:', err.message);
      return;
    }
    console.log('Tables dropped successfully.');

    // Buat tabel 'users' terlebih dahulu
    db.query(createUsersTableQuery, (err, result) => {
      if (err) {
        console.error("Failed to create the 'users' table:", err.message);
        return;
      }
      console.log("Table 'users' created successfully.");

      // Buat tabel 'kedinasan' setelahnya
      db.query(createKedinasanTableQuery, (err, result) => {
        if (err) {
          console.error("Failed to create the 'kedinasan' table:", err.message);
          return;
        }
        console.log("Table 'kedinasan' created successfully.");

        // Buat tabel 'chat_session'
        db.query(createChatSessionTableQuery, (err, result) => {
          if (err) {
            console.error("Failed to create the 'chat_session' table:", err.message);
            return;
          }
          console.log("Table 'chat_session' created successfully.");

          // Buat tabel 'chat_message'
          db.query(createChatMessageTableQuery, (err, result) => {
            if (err) {
              console.error("Failed to create the 'chat_message' table:", err.message);
              return;
            }
            console.log("Table 'chat_message' created successfully.");

            // Buat tabel 'reports' terakhir
            db.query(createReportsTableQuery, (err, result) => {
              if (err) {
                console.error("Failed to create the 'reports' table:", err.message);
                return;
              }
              console.log("Table 'reports' created successfully.");

              // Menjalankan seeder untuk tabel 'kedinasan'
              db.query(insertKedinasanQuery, (err, result) => {
                if (err) {
                  console.error("Failed to seed 'kedinasan' table:", err.message);
                  return;
                }
                console.log("Table 'kedinasan' seeded successfully.");

                // Tutup koneksi database setelah semua operasi selesai
                db.end((err) => {
                  if (err) {
                    console.error('Error closing the database connection:', err.message);
                  } else {
                    console.log('Database connection closed.');
                  }
                });
              });
            });
          });
        });
      });
    });
  });
}

runMigrationAndSeed();
