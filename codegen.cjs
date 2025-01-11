module.exports = {
  schema: 'http://localhost:8080/v1/graphql',
  // schema: 'https://indexer.dev.hyperindex.xyz/ec9b3b7/v1/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
};
