import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register(/*{ strapi }*/) {
    if (process.env.NODE_ENV === 'production') {
      const client = new SecretManagerServiceClient();

      try {
        const [accessResponse] = await client.accessSecretVersion({
          name: process.env.DATABASE_CA_SECRET_NAME,
        });
      
        const responsePayload = accessResponse.payload.data.toString();
        if (!responsePayload) {
          throw new Error('Secret payload is empty');
        }
      
        process.env.DATABASE_CA = responsePayload;
        console.log('SSL certificate successfully loaded.');
      } catch (error) {
        throw new Error(`Error during SSL certificate retrieval: ${error}`);
      }
    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
