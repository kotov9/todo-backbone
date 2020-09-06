console.log('running');

var bus = _.extend({}, Backbone.Events);

var CarModel = Backbone.Model.extend({
    initialize(options) {
        console.log("Car created. |", options);
    },

    defaults: {
        color: 'black',
    },

    validate(attrs, options) {
        console.log('Validate options: ', options);
        if (!attrs.number) return 'Car should have a number.';
    },

});

var Cars = Backbone.Collection.extend({
    model: CarModel,
});

var CarView = Backbone.View.extend({
    tagName: 'li',

    initialize(options) {
        this.bus = options.bus;
    },

    events: {
        'click': 'showInfo',
    },

    showInfo() {
        this.bus.trigger('showInfo', { car: this.model.toJSON() });
    },

    render() {
        this.$el.html(this.model.get('number'));
        this.$el.data({color: this.model.get('color')});
        return this;
    }
});

var CarViewInfo = Backbone.View.extend({
    render() {
        this.$el.html(`<p>Number: ${this.model.get('number')}<br>Color: ${this.model.get('color')}</p>`);
        return this;
    }
});

var CarsViews = Backbone.View.extend({
    initialize(options) {
        this.bus = options.bus;
    },

    render() {
        var self = this;
        this.collection.each(function(car) {
            var view = new CarView({ model: car, bus: self.bus });
            self.$el.append(view.render().$el);
        });
    }
});

var InfoView = Backbone.View.extend({
    initialize(options) {
        this.bus = options.bus;
        this.bus.on('showInfo', this.render, this);
    },

    render(args) {
        if (args && args.car) {
            this.$el.html(`<p>Number: ${args.car.number}<br>Color: ${args.car.color}</p>`);
        }
        return this;
    }
});

var WrongInfoView = Backbone.View.extend({
    render() {
        this.$el.html('<h2>Sorry, nothing to show.</h2>');
        return this;
    }
});

// --------------------------------------------------

var cars = new Cars([
    new CarModel({ number: 'vg436k' }),
    new CarModel({ number: 'pt532o', color: 'red' }),
    new CarModel({ number: 're900t' })
]);

var AppRouter = Backbone.Router.extend({
    initialize() {
        console.log('Router created');
    },

    routes: {
        '': 'main',
        'info/:ind': 'info',
        '*other': 'other'
    },

    main() {
        console.log('on main')
        var carsViews = new CarsViews({ bus, el: '#carsList', collection: cars });
        var infoView = new InfoView({ bus, el: '#carInfo'});
        carsViews.render();
        infoView.render();
    },

    info(ind) {
        console.log('on info', ind);
        var car = cars.at(ind);
        if (car) {
            var carView = new CarViewInfo({ model: car, el: "#container"});
            carView.render();
        }
    },

    other() {
        console.log('other');
    }
});

var router = new AppRouter();
$(document).ready(function(){
    Backbone.history.start({pushState:true})
})