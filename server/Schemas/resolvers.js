const { User } = require('../models');
const { signToken, authMiddleware } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id})
            }
        }
    },
    Mutation: {
        
    }
}

module.exports = resolvers;