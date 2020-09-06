const { View } = require('backbone');
const $ = require('jquery');
const MissionPreview = require('./missionPreview');
const MissionModel = require('./missionModel');
const allMissionsTemplate = require('./templates/missionsAll.twig');
const editMissionViewRender = require('./missionEditViewRender');


module.exports = View.extend({
    className: 'all-missions',
    tagName: 'div',

    events: {
        'click .add-mission':   'tryAddMission',
    },

    initialize() {
        this.listenTo( this.collection, 'reset add change remove', this.render, this );
        this.$el.html(allMissionsTemplate())
    },

    tryAddMission() {
        const self = this;
        const settings = {
            onConfirm: self.onConfirmAddMission.bind(self),
            templateData: {
                yes: 'add',
                no: 'cancel'
            }
        };
        editMissionViewRender(settings)
    },

    onConfirmAddMission(data) {
        const mission = new MissionModel({...data});
        mission.save({},{
            success: (data) => {
                console.log('[mission added]', data);
                this.collection.add(mission);
            },
            error: () => console.error('[mission editing, server error]')
        });
    },

    renderMissionsPreview(missions) {
        this.collection.forEach(model => {
            this.renderMissionPreview(model);
        });
    },

    renderMissionPreview(mission) {
        const preview = new MissionPreview({ model: mission });
        this.$el.find('.missions-list').append(preview.render().$el);
    },

    render() {
        this.$el.find('.missions-list').html('');
        this.renderMissionsPreview(this.collection);
        return this;
    }
});
