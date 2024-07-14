const { saveBook } = require('../controllers/user-controller');
const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks')        
      }
      throw AuthenticationError('You need to be logged in!');
    }
  },
  Mutation: {
    login: async (parent, { username, email, password }) => {
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (!user) {
        throw AuthenticationError;
      }

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async(parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error('Failed to create user.');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, {input}) => {
      try {
        const loggedUser = await User.findOneAndUpdate(
          { _id: input.userId },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return loggedUser;
      } catch (err) {
        return AuthenticationError;
      }
    },
    removeBook: async (parent, {user, params}) =>{
      const loggedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      if (!loggedUser) {
        throw new Error ("Failed to find user.");
      }
      return loggedUser;
    }
  },
};

module.exports = resolvers;
