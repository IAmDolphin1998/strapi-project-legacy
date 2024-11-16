import path from 'path';

export default ({ env }) => {
  return {
    connection: {
      client: 'sqlite',
      sqlite: {
        connection: {
          filename: path.join(
            __dirname,
            '..',
            '..',
            env('DATABASE_FILENAME', '.tmp/data.db')
          ),
        },
        useNullAsDefault: true,
      },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
