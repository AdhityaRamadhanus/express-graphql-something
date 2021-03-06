
const graphql = require ('graphql')
const mongoResolver = require('../resolvers/mongodb')
const mysqlResolver = require('../resolvers/mysql')
const resolver = mysqlResolver
var TodoType = new graphql.GraphQLObjectType({  
  name: 'todo',
  fields: {
    id: {
      type: graphql.GraphQLID
    },
    title: {
      type: graphql.GraphQLString
    },
    completed: {
      type: graphql.GraphQLBoolean
    }
  }
})

var queryType = new graphql.GraphQLObjectType({  
  name: 'Query',
  fields: {
    todos: {
      type: new graphql.GraphQLList(TodoType),
      resolve: resolver.getAll
    },
    todosId: {
      type: TodoType,
      args: {
        id: {
          name: 'Todo Id',
          type: graphql.GraphQLID
        }
      },
      resolve: resolver.getOne
    }
  }
})

var MutationAdd = {  
  type: TodoType,
  description: 'Add a Todo',
  args: {
    title: {
      name: 'Todo title',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  },
  resolve: resolver.addTodo
}

var MutationDelete = {
  type: TodoType,
  description: 'Delete a todo',
  args: {
    id: {
      name: 'Todo id',
      type: graphql.GraphQLID
    }
  },
  resolve: resolver.deleteTodo
}

var MutationDeleteAll = {
  type: graphql.GraphQLString,
  description: 'Delete all todo',
  resolve: resolver.deleteAllTodo
}

var MutationDeleteCompleted = {
  type: new graphql.GraphQLList(TodoType),
  description: 'Delete all completed todo',
  resolve: resolver.deleteAllCompletedTodo
}

var MutationToggleOne = {
  type: TodoType,
  description: 'Toggle one todos to completed',
  args: {
    id: {
      name: 'Todo id',
      type: graphql.GraphQLID
    }
  },
  resolve: resolver.toggleOne
}

var MutationToggleAll = {
  type: new graphql.GraphQLList(TodoType),
  description: 'Toggle all todos to completed',
  resolve: resolver.toggleAll
}

var MutationUpdate = {
  type: TodoType,
  description: 'Update a todo',
  args: {
    id: {
      name: 'Todo id',
      type: graphql.GraphQLID
    },
    title: {
      name: 'Todo title',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  },
  resolve: resolver.saveTodo
}

var MutationType = new graphql.GraphQLObjectType({  
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    delete: MutationDelete,
    deleteAll: MutationDeleteAll,
    deleteCompleted: MutationDeleteCompleted,
    toggleOne: MutationToggleOne,
    toggleAll: MutationToggleAll,
    update: MutationUpdate
  }
})

module.exports = new graphql.GraphQLSchema({  
  query: queryType,
  mutation: MutationType
})
