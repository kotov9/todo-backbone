const MissionModel = require('./missionModel');
const MissionsCollection = require('./missionsCollection');
const MissionView = require('./missionView');
const MissionsPreview = require('./missionsPreview');

// return views
module.exports = {
    constructMissionView(id) {

        console.log(id)
        // mission.fetch();

        // // temporary -----------------------
        // const mission = new MissionModel({
        //     title: 'mission1',
        //     description: 'important mission 1',
        //     author: 'me',
        //     tasks: [
        //         {
        //             description: 'task mission 1.1'
        //         }, {
        //             description: 'task mission 1.2'
        //         }
        //     ]
        // });
        // // temporary -----------------------/

        return new Promise((resolve, reject) => {
            const mission = new MissionModel({id});
            mission.fetch({
                success: () => resolve(new MissionView({ model: mission })),
                error: (error) => reject(error)
            });
        });
    },

    constructMissionsPreview() {


        // // temporary -----------------------
        // const mission1 = new MissionModel({
        //     title: 'mission1',
        //     description: 'important mission 1',
        //     author: 'me',
        //     tasks: [
        //         {
        //             description: 'task mission 1.1'
        //         }, {
        //             description: 'task mission 1.2'
        //         }
        //     ]
        // });
        //
        // const mission2 = new MissionModel({
        //     title: 'mission2',
        //     description: 'important mission 2',
        //     author: 'me',
        //     tasks: [
        //         {
        //             description: 'task mission 2.1'
        //         }, {
        //             description: 'task mission 2.2'
        //         }
        //     ]
        // });
        // const missions = new MissionsCollection([mission1, mission2]);
        // temporary -----------------------/
        return new Promise((resolve, reject) => {
            const missions = new MissionsCollection();
            missions.fetch({
                success: () => resolve(new MissionsPreview({collection: missions})),
                error: (error) => reject(error)
            });
        });
    }
}
