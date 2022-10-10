import { React } from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";

const cache = new InMemoryCache({
  typePolicies: {
    Book: {
      keyFields: ["title"],
      fields: {
        bookId: () => Math.floor(Math.random() * 10),
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache,
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
