const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id })
            }
        }
    },
    Mutation: {

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { input }, context) => {
            const { bookId, authors, description, title, image, link } = input;

            const { user } = context;

            user.savedBooks.push({ bookId, authors, description, title, image, link });

            await user.save();

            return user;
        },
        removeBook: async (_, { bookId }, context) => {
            const { user } = context;

            if (!user) {
                throw new AuthenticationError('You need to be logged in to perform this action');
            }

            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );

                return updatedUser;
            } catch (error) {
                throw new Error('Failed to remove the book from the user');
            }
        }
    }
}

module.exports = resolvers;