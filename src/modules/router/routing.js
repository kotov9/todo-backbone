const { Router } = require('backbone');
const $ = require('jquery');
const bus = require('../events/bus');
const render = require('../app/renderer');

const {
    constructMissionsPreview,
    constructMissionView
} = require('../mission');


module.exports = function() {
    $(document).on("click", "a:not([data-bypass])", function(evt) {
        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
        var root = location.protocol + "//" + location.host + Backbone.history.options.root;

        if (href.prop && href.prop.slice(0, root.length) === root) {
            evt.preventDefault();
            Backbone.history.navigate(href.attr, true);
        }
    });

    const router = new (Router.extend({
        routes: {
            "":                 "home",
            "missions":         "missions",
            "missions/:id":     "mission",
            "help":             "help",
        },

        home() {
            console.log('[at home]')
            render();
        },

        missions() {
            console.log('[missions]');
            constructMissionsPreview()
                .then(view => render({view}));
        },

        mission(id) {
            console.log('[mission]', id);
            constructMissionView(id)
                .then(view => render({view}));
        }
    }))();

    console.log('[Router launched]');
    Backbone.history.start({
        pushState: true
    });

    bus.on('redirect', (path) => {
        Backbone.history.navigate(path, { trigger: true })
    })
};