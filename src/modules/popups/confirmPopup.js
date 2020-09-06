const { View } = require('backbone');
const $ = require('jquery');
const confirmPopupTemplate = require('../popups/templates/confirmPopup.twig')


module.exports = View.extend({
    className: 'popup',
    id: 'popup',

    initialize(args) {
        console.log(args);
        this.onConfirm = args.onConfirm;
        this.onCancel = args.onCancel;
        this.template = args.template || confirmPopupTemplate;
        this.focusOn = args.focusOn;
        if (typeof this.onConfirm !== 'function') throw Error('onYesHandler function should be provided');
        this.templateData = args.templateData;
        this.closePopup();
    },

    events: {
        'click .popup-confirm':  'onConfirm',
        'click .popup-cancel': 'onCancel',
    },

    closePopup() {
        $(`#${this.id}`).remove();
    },

    onConfirm() {
        const inputs = this.$el.find('.popup-input');
        let data = {};
        inputs.each(function() {
            const name = $(this).data('name');
            const value = $(this).val() || $(this).text();
            if (String(value).trim().length) data[name] = value;
        });
        this.onConfirm(data);
        this.closePopup();
    },

    onCancel() {
        if (typeof this.onCancel === 'function') this.onCancel()
        this.closePopup();
    },

    render() {
        $('#content').append(this.$el.append(this.template(this.templateData)));
        if (this.focusOn) {
            this.$el.find(this.focusOn).focus();
        }
        return this;
    }
});
