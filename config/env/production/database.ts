import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

async function accessSecret(secretName: string) {
  const [accessResponse] = await client.accessSecretVersion({
    name: secretName,
  });

  const responsePayload = accessResponse.payload.data.toString();
  if (!responsePayload) {
    throw new Error(`Failed to retrieve secret: ${secretName}`);
  }

  return responsePayload
}

export default async ({ env }) => {
  const cacert = await accessSecret(env('DATABASE_CA_SECRET_NAME'));

  return {
    connection: {
      client: 'postgres',
      postgres: {
        connection: {
          connectionString: env('DATABASE_URL', ''),
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: cacert,
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool(
              'DATABASE_SSL_REJECT_UNAUTHORIZED',
              true
            ),
          },
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
      },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
