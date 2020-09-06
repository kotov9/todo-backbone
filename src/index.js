import Backbone from 'backbone';
import $ from 'jquery';
import './assets/styles/main.scss';

// ------------------------------------------------------------------
const Task = require('./modules/task/taskModel');
const Tasks = require('./modules/task/tasksCollection');
const TasksView = require('./modules/task/tasksView');

const Missions = require('./modules/mission/missionsCollection');
const Mission = require('./modules/mission/missionModel');
const MissionVew = require('./modules/mission/missionView');
const MissionPreview = require('./modules/mission/missionPreview');
const MissionsPreview = require('./modules/mission/missionsPreview');
// ---------------------------------------------------------------------------------------------------------------------

// const task = new Task({
//     description: 'Very important task'
// });
//
// const tasks = new Tasks([task]);
// const tasksView = new TasksView({
//     collection: tasks,
// });
//
// $('#content').html(tasksView.render().el)

// const mission1 = new Mission({
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
// const mission2 = new Mission({
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
//
// const missions = new Missions([mission1, mission2]);
// const missionView = new MissionVew({
//     model: mission
// });
// const missionPreview = new MissionPreview({
//     model: mission1,
//     el: '#content'
// });
// missionPreview.render();
// const missionsPreview = new MissionsPreview({collection: missions});

// $('#content').append(missionsPreview.render().$el);

// const {
//     constructMissionsPreview,
//     constructMissionView
// } = require('./modules/mission/');
// const render = require('./modules/app/renderer');
// render({view: constructMissionView()});

const app = require('./modules/app/app');

$(document).ready(app);
