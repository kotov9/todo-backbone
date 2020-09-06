const editTaskTemplate = require('../popups/templates/editTaskPopup.twig');
const ConfirmPopup = require('../popups/confirmPopup');


module.exports = function(settings) {
    return new ConfirmPopup({ template: editTaskTemplate, ...settings}).render();
}
