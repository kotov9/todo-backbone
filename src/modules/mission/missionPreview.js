const { View } = require('backbone');
const Missions = require('./missionsCollection');
const previewTwig = require('./templates/missionPreview.twig');
const removeMissionViewRender = require('./missionRemoveViewRender');
const editMissionViewRender = require('./missionEditViewRender');


module.exports = View.extend({
    className: 'mission-preview',
    tagName: 'div',

    events: {
        'click .mission-edit':      'tryEditMission',
        'click .mission-remove':    'tryRemoveMission',
    },

    initialize() {
        Object
            .entries(this.model.toJSON())
            .forEach(([key, value]) => this[key] = value);
        this.progress = this.getProgress();
    },

    getProgress() {
        const tasks = this.tasks || [];
        if (!this.tasks.length) return -1;
        return Math.ceil(this.tasks.filter(task => task.completed).length * 100 / this.tasks.length);
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

    triggerMissionChanged() {
        bus.trigger('mission-changed', {id: this.model.id});
    },

    render() {
        const {
            title,
            description,
            author,
            progress,
            creation,
            id
        } = this;


        const template = previewTwig({
            id,
            title,
            description,
            author,
            progress,
            creation
        });
        this.$el.append(template);
        return this;
    }
});
