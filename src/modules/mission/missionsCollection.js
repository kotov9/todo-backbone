const { Collection } = require('backbone');
const missionModel = require('./missionModel');


module.exports = Collection.extend({
    url: 'http://localhost:3001/missions/',
    model: missionModel,

    // initialize(missions) {
    //     this.listenTo(this.collection, 'add', function (model) {
    //         console.log(model);
    //     });
    //     if (missions) this.save(missions)
    // },

    // save(missions) {
    //     try {
    //         missions.forEach(function(mission) {
    //             mission.save({});
    //         })
    //     } catch(e) {
    //         console.log(e);
    //     }
    // }
});

