const typeDefs = `
    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth 
        saveBook(input: saveBookInput): User 
        removeBook(bookId: ID): User
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: String
        user: User
    }

    input saveBookInput {
        bookId: ID!
        title: String
        authors: [String]
        description: String
        image: String
        link: String
        userId: ID!
    }
`;

module.exports = typeDefs;
