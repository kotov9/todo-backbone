const Backbone = require('backbone');
const $ = require('jquery');
const indexTemplate = require('../_templates/index.twig');
const initRouting = require('../router/routing');


module.exports = function(params) {
    document.body.innerHTML = indexTemplate();
    initRouting();
}
