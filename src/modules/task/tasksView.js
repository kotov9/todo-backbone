const _ = require('underscore')
const { View } = require('backbone');
const TaskView = require('./taskView');


module.exports = View.extend({
    tagName: 'ul',
    className: 'tasks',

    render() {
        const self = this;
        this.collection.each(function(task) {
            const taskView = new TaskView({ model: task });
            self.$el.append(taskView.render().$el);
        })
        return this;
    }
})