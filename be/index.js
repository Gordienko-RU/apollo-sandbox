const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Book {
    title: String
    author: String
    birthDate: String
  }

  type Query {
    books(title: String): [Book]
  }

  type Mutation {
    addBook(title: String!, author: String!, birthDate: String!): Book
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    birthDate: '12.32.5323',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    birthDate: '23.53.2345',
  },
  {
    title: 'City of Grass',
    author: 'Paul Auster',
    birthDate: '12.34.5342',
  },
  {
    title: 'City of Wood',
    author: 'Paul Auster',
    birthDate: '12.34.5342',
  },
];

const resolvers = {
  Query: {
    books: (_, args) => {
      const { title: searchedTitle } = args;

      if (!searchedTitle) {
        return books;
      }

      const searchedBook = books.find(({ title }) => title === args.title);

      return searchedBook ? [searchedBook] : [];
    },
  },
  Mutation: {
    addBook: (_, newBook) => {
      books.push(newBook);

      return newBook;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
