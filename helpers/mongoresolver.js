const mongoose = require('mongoose')
const Todo = mongoose.model('Todo')
const async = require('async')

module.exports.getAll = (roots, args, req) => {
	return new Promise((resolve, reject) => {
    Todo.find({}, (err, todos) => {
      if (err) reject(err)
      else resolve(todos)
    })
  })
}

module.exports.addTodo = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    var newTodo = new Todo({
      title: args.title
    })
    newTodo.save((err, createdTodo) => {
      if (err) reject(err)
      else resolve(createdTodo)
    })
  })
}

module.exports.deleteTodo = (roots, args, req) => {
  return new Promise((resolve, reject) => {
   Todo.findByIdAndRemove(args.id, (err, removedTodo) => {
    if (err) reject(err)
    else if (!removedTodo) reject(new Error('Todos Not Found!'))
    else resolve(removedTodo)
   }) 
  })
}

module.exports.toggleOne = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    Todo.findByIdAndUpdate(args.id, {completed: true}, {new: true}, (err, updatedTodo) => {
      if (err) reject(err)
      else resolve(updatedTodo)
    })
  })
}

module.exports.toggleAll = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    async.waterfall([
      (cb) => {
        Todo.update({}, {completed: true}, {multi: true}, (err, response) => {
          cb(err)
        })
      },
      (cb) => {
        Todo.find({}, (err, todos) => {
          cb(err, todos)
        })
      }
    ], (err, todos) => {
        if (err) reject(err)
        else resolve(todos)
      }
    )
  })
}

module.exports.saveTodo = (roots, args, req) => {
  return new Promise((resolve, reject) => {
    Todo.findByIdAndUpdate(args.id, {title: args.title}, {new: true}, (err, updatedTodo) => {
      if (err) reject(err)
      else resolve(updatedTodo)
    })
  })
}