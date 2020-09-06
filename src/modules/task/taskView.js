const $ = require('jquery');
const { View } = require('backbone');
const bus = require('../events/bus');
const taskTemplate = require('./templates/task.twig');
const editTaskViewRender = require('./taskEditViewRender');
const removeTaskViewRender = require('./taskRemoveViewRender');


module.exports = View.extend({
    tagName: 'li',
    className: 'task',

    events: {
        'click .task__checkbox':    'toggleCompletion',
        'click .task__description': 'toggleCompletion',
        'click .task__remove':      'tryRemoveTask',
        'click .task__edit':        'tryEditTask'
    },

    toggleCompletion() {
        const completed = !this.model.get('completed');
        const completionDate = completed ?
            new Date() :
            null;
        this.model.set({
            completed,
            completionDate
        });
        this.triggerTaskChanged();
        this.render();
    },

    tryRemoveTask() {
        const self = this;
        const settings = {
            onConfirm: self.onConfirmRemoval.bind(self),
            templateData: {
                text: 'Are you sure you want to delete the task?',
                yes: 'Yes',
                no: 'No'
            }
        };
        removeTaskViewRender(settings);
    },

    triggerTaskChanged() {
        bus.trigger('task-changed', this.model.cid);
    },

    onConfirmRemoval() {
        this.model.clear();
        this.model.destroy();
        this.$el.remove();
        this.triggerTaskChanged();
    },

    tryEditTask() {
        const self = this;
        const settings = {
            onConfirm: self.onConfirmEditing.bind(self),
            focusOn: '.task-editable',
            templateData: {
                task: self.model.get('description'),
                yes: 'edit',
                no: 'cancel'
            }
        };
        editTaskViewRender(settings);
    },

    onConfirmEditing(data) {
        this.model.set('description', data.description);
        this.render();
        this.triggerTaskChanged();
    },

    render() {
        this.$el.html(taskTemplate(this.model.toJSON()));
        return this;
    }
});
