const ConfirmPopup = require('../popups/confirmPopup');


module.exports = function(settings) {
    return new ConfirmPopup(settings).render();
}
