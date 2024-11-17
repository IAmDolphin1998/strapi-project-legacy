import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

async function accessSecret(secretName: string) {
  try {
    const [accessResponse] = await client.accessSecretVersion({
      name: secretName,
    });
  
    const responsePayload = accessResponse.payload.data.toString();
    if (!responsePayload) {
      throw new Error('Secret payload is empty');
    }
  
    return responsePayload
  } catch (error) {
    throw new Error(`Failed to access secret: ${error}`);
  }
}

export default async ({ env }) => {
  const cacert = await accessSecret(env('DATABASE_CA_SECRET_NAME'));

  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString: env('DATABASE_URL', ''),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        schema: env('DATABASE_SCHEMA', 'public'),
        ssl: env.bool('DATABASE_SSL', false) && {
          ca: cacert,
          rejectUnauthorized: env.bool(
            'DATABASE_SSL_REJECT_UNAUTHORIZED',
            true
          ),
        },
      },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
