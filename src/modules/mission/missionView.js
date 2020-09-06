const { View } = require('backbone');
const bus = require('../events/bus');
const Task = require('../task/taskModel');
const Tasks = require('../task/tasksCollection');
const TaskView = require('../task/taskView');
const TasksView = require('../task/tasksView');
const missionTemplate = require('./templates/mission.twig');
const removeMissionViewRender = require('./missionRemoveViewRender');
const editMissionViewRender = require('./missionEditViewRender');
const editTaskViewRender = require('../task/taskEditViewRender');



module.exports = View.extend({
    className: 'mission',

    events: {
        'click .mission-edit':      'tryEditMission',
        'click .mission-remove':    'tryRemoveMission',
        'click .add-task':          'tryAddTask',
    },

    initialize() {
        var rawTasks = this.model.get('tasks') || [];
        this.tasks = new Tasks();
        rawTasks.forEach((task) => {
            const model = new Task({...task});
            this.tasks.add(model);
        });
        bus.on('task-changed', () => {
            this.renderProgress();
            this.saveTasks();
        });
        this.tasks.on('add', (task) => {
            this.renderTask(task);
            this.renderProgress();
            this.saveTasks();
        });
    },

    saveTasks () {
        this.model.save({ tasks: this.tasks.toJSON()}, {
            success: () => console.log('[mission saved]'),
            error: () => console.log('[error on mission saving]')
        });
    },

    tryRemoveMission() {
        const self = this;
        const settings = {
            onConfirm: self.onConfirmRemoval.bind(self),
            templateData: {
                text: 'Are you sure you want to delete the mission?',
                yes: 'yes',
                no: 'no'
            }
        };
        removeMissionViewRender(settings)
    },

    onConfirmRemoval() {
        this.model.destroy({
            success: () => bus.trigger('redirect', 'missions'),
            error: (error) => console.error(error)
        });
    },

    tryEditMission() {
        const self = this;
        const settings = {
            onConfirm: self.onConfirmEditing.bind(self),
            // focusOn: '#mission-title',
            templateData: {
                ...this.model.toJSON(),
                yes: 'edit',
                no: 'cancel'
            }
        };
        editMissionViewRender(settings)
    },

    onConfirmEditing(data) {
        this.model.set('title', data.title);
        this.model.set('description', data.description);
        this.model.set('author', data.author);
        this.model.save({},{
            success: () => console.log('[mission edited]'),
            error: () => console.log('[mission editing, server error]')
        });
        this.render();
    },

    tryAddTask() {
        const self = this;
        const settings = {
            onConfirm: self.onConfirmAddingTask.bind(self),
            focusOn: '.task-editable',
            templateData: {
                yes: 'add',
                no: 'cancel'
            }
        };
        editTaskViewRender(settings);
    },

    onConfirmAddingTask(data) {
        if (!Object.keys(data).length) return;
        this.tasks.add(data);
    },

    getProgress() {
        let completed = 0;
        const all = this.tasks.length || 1;
        this.tasks.forEach(function(task) {
            if (task.get('completed')) completed++;
        });
        return Math.ceil(completed * 100 /all);
    },

    renderTask(task) {
        const taskView = new TaskView({ model: task});
        this.$el.find('.tasks').append(taskView.render().$el);
    },

    renderTasks(tasks) {
        const tasksView = new TasksView({
            collection: tasks
        });
        this.$el.find('.tasks-list')
            .append(tasksView.render().el);
    },

    renderProgress() {
        const tasks = this.tasks || [];
        const progressContainer = this.$el.find('.mission-progress');
        if (!tasks.length) progressContainer.hide();
        else {
            progressContainer.css('display', 'flex');
            progressContainer
                .find('.progress')
                .text(this.getProgress())
        }
    },

    renderMission() {
        this.$el.html(missionTemplate({
            ...this.model.toJSON(),
        }));
        this.renderProgress();
        this.renderTasks(this.tasks);
    },

    render() {
        this.renderMission();
        return this;
    }
});
