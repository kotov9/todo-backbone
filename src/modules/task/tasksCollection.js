const { Collection } = require('backbone');
const TaskModel = require('./taskModel');


module.exports = Collection.extend({
    model: TaskModel
});
