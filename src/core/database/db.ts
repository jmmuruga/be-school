export const appSource = new DataSource({
  type: "mssql",
  // Changed from DB_SERVER_HOST to DB_SERVER to match your .env
  host: process.env.DB_SERVER, 
  // Changed from DB_PORT to ensure it uses 1436 as seen in your logs
  port: parseInt(process.env.DB_PORT || "1436"), 
  // Changed from DB_USERNAME to DB_USER to match your .env
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  synchronize: true, // Be careful with this in production!
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  extra: {
    trustServerCertificate: true,
    requestTimeout: 60000
  },
});
