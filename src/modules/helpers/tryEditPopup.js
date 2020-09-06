const ConfirmPopup = require('../popups/confirmPopup');

module.exports = function(settings) {
    // const popupView = new ConfirmPopup(settings);
    // popupView.render();
    return new ConfirmPopup(settings);
}
