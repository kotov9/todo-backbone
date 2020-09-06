const $ = require('jquery');

module.exports = function({ view, id="#content", rawContent, template}={}) {
    const parent = $(id)
    if (view) return parent.html(view.render().$el);
    if (template) return parent.html(tempate);
    if (rawContent) return parent.html(rawContent);
    return parent.html('');
}