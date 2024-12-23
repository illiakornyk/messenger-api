import { config } from '@app/config';

export function getDatabaseSslConfig() {
  const isSslEnabled = config.database.isSslEnabled;
  const rejectUnauthorized = config.database.rejectUnauthorized;

  return isSslEnabled ? { rejectUnauthorized } : undefined;
}
