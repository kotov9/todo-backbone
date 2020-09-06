const { Model } = require("backbone");


module.exports = Model.extend({
    urlRoot: 'http://localhost:3001/missions/',

    defaults: {
        id: null,
        creation: new Date(),
        completion: null,
        completed: false,
        author: 'unknown',
        title: 'Code Name [secret]',
        description: '',
        tasks: []
    },


});
