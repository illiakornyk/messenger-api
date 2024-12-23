import * as dotenv from 'dotenv';
dotenv.config();

function parseEnvBoolean(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

export const config = {
  database: {
    isSslEnabled: parseEnvBoolean(process.env.DB_ENABLE_SSL),
    rejectUnauthorized: parseEnvBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED),
  },
};
