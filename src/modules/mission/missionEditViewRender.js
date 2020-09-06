const editMissionTemplate = require('../popups/templates/editMissionPopup.twig');
const ConfirmPopup = require('../popups/confirmPopup');


module.exports = function(settings) {
    return new ConfirmPopup({ template: editMissionTemplate, ...settings}).render();
}
