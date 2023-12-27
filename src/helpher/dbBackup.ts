// backup.ts

import shell from "shelljs";
import moment from "moment";

const backupDatabase = async () => {
  const timestamp = moment().format("YYYYMMDD-HHmmss");
  const backupFileName = `backup-${timestamp}.sql`;

  // Replace these with your actual database details
  const databaseHost = `${process.env.DBHOST}`;
  const databaseUser = `${process.env.DBUSER}`;
  const databasePassword = `${process.env.DBPASSWORD}`;
  const databaseName = `${process.env.DBPASSWORD}`;

  // Run mysqldump command to create a backup
  const command = `mysqldump -h ${databaseHost} -u ${databaseUser} -p${databasePassword} ${databaseName} > ${backupFileName}`;
  const result = shell.exec(command, { silent: true });

  if (result.code === 0) {
    console.log("Database backup completed successfully.");
  } else {
    console.error("Error creating database backup:", result.stderr);
  }
};

export default backupDatabase;
