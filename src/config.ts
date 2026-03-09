import { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();
export type DBConfig = {
    db_url: string;
    migrationConfig: MigrationConfig;
};
export const db: DBConfig = {
    db_url: `${process.env.DB_URL}`,
    migrationConfig: {
        migrationsFolder: "./src/db",
    },
};