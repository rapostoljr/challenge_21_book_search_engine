const { saveBook } = require('../controllers/user-controller');
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // // I might need, but prompt is only asking for me
    // users: async () => {
    //   return User.find().populate('savedBooks');
    // },
    // user: async (parent, { username }) => {
    //   return User.findOne({ username }).populate('savedBooks');
    // },
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
      const correctPassword = await User.isPasswordCorrect(password);
      if (!correctPassword) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async(parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      if (!user) {
        throw new Error('Failed to create user.');
      }
      return { token, user };
    },
    // saveBook: async(parent,  ) => {
      
    // }
  },
};

module.exports = resolvers;
