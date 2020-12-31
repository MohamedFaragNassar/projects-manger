const projectResolvers = require("../resolvers.js/project")
const taskResolvers = require("../resolvers.js/task")
const usersResolvers = require("../resolvers.js/users")

const RootResolver = {
    ...projectResolvers,
    ...taskResolvers,
    ...usersResolvers
}

module.exports = RootResolver;