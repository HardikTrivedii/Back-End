// schedule-backup.ts

import cron from "node-cron";
import backupDatabase from "./dbBackup";

// Schedule backups to run daily at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running database backup...");
  backupDatabase();
});
