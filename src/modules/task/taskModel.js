const { Model } = require('backbone');


module.exports = Model.extend({
    defaults: {
        taskId: '_',
        description: '',
        completed: false,
        completionDate: ''
    },

    validate(attrs) {
        if (!attrs.description) return 'Provide a description';
    }
});
