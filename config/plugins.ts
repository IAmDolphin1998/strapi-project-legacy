export default ({ env }) => ({
  "strapi-algolia": {
    enabled: true,
    config: {
      apiKey: env("ALGOLIA_ADMIN_KEY"),
      applicationId: env("ALGOLIA_APP_ID"),
      contentTypes: [
        {
          name: "api::document.document",
          index: "document_index",
          populate: {
            Authors: {
              fields: ["Name", "Email"],
              populate: {
                Avatar: {
                  fields: ["url", "alternativeText", "width", "height"],
                },
              },
            },
            Area: {
              fields: ["Name"],
            },
            Tags: {
              fields: ["Name"],
            },
            Thumbnail: {
              fields: ["url", "alternativeText", "width", "height"],
            },
          },
          hideFields: ["createdAt", "updatedAt", "publishedAt", "updatedBy"],
        },
      ],
    },
  },
  "import-export-entries": {
    enabled: true,
  },
});
