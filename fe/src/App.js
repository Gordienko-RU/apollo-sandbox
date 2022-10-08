import { useState } from 'react';
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';

const COMMON_BOOK_FIELDS = gql`
  fragment commonBookFields on Book {
    title
  }
`;

const GET_BOOKS = gql`
  ${COMMON_BOOK_FIELDS}
  query getBooks {
    books {
      ...commonBookFields
    }
  }
`;

function Books({ onClick }) {
  const { loading, error, data } = useQuery(GET_BOOKS, {
    // pollInterval: 4000,
    // notifyOnNetworkStatusChange: true,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.books.map(({ title }) => (
    <div key={title} onClick={() => { onClick(title)} }>
      <h3>{title}</h3>
    </div>
  ));
}

const GET_BOOK = gql`
  query getBook($title: String!) {
    books(title: $title) {
      author
      birthDate
    }
  }
`;

function BookDescription({ title }) {
  const [getBook, { loading, error, data }] = useLazyQuery(GET_BOOK, {
    variables: { title },
  });

  if (!title) {
    return null;
  } else if(!data && !loading) {
    return <button onClick={getBook}>Get info</button>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div key={'desc'}>
      <h3>Description:</h3>
      <h3>{data.books[0].author}</h3>
      <h3>{data.books[0].birthDate}</h3>
    </div>
  );
}

const CREATE_BOOK = gql`
  ${COMMON_BOOK_FIELDS}
  mutation AddBook($title: String!, $author: String!, $birthDate: String!) {
    addBook(title: $title, author: $author, birthDate: $birthDate) {
      ...commonBookFields
    }
}`;

const AddBookButton = () => {
  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      'getBooks',
    ],
  });

  const handleBookAdding = () => {
    addBook({ variables: { title: 'new book', author: 'new author', birthDate: '24.34.2004'}});
  };

  return <button onClick={handleBookAdding}>Add book</button>;
}

export default function App() {
  const [selectedTitle, setSelectedTitle] = useState(null);

  return (
    <div>
      <Books onClick={setSelectedTitle} />
      <BookDescription title={selectedTitle} />
      <AddBookButton />
    </div>
  );
}
