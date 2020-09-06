const bus = _.extend({}, Backbone.Events);

const Vehicle = Backbone.Model.extend({
    urlRoot: 'api/vehicles',

    validate(attrs) {
        if (!attrs.registrationNumber) return "registarionNumber is absent";
    },

    start() {
        console.log('Vehicle is on');
    },
});
const Car = Vehicle.extend({
    start() {
        Vehicle.prototype.start();
        console.log(`Vehicle with number ${this.model.get('registrationNumber')} ${this.model.get('color')} has started`);
    },

    validate(attrs) {
        let notValidated;
        notValidated = Vehicle.prototype.validate(attrs);
        if (notValidated) return notValidated;
        if (!attrs.color) {
            return 'color is missing';
        }
    }
});
const Cars = Backbone.Collection.extend({
    model: Car
})

const car = new Car({registrationNumber: 'b216nk'});
const cars = new Cars([
    {color: 'blue', registrationNumber: 'XLI887'},
    {color: 'blue', registrationNumber: 'ZNP123'},
    {color: 'gray', registrationNumber: 'XUV456'},
])

const CarView = Backbone.View.extend({
    initialize(options) {
        this.model.on('set', this.onSetHandler, this);
    },

    onSetHandler(value) {
        console.log('set: ', value);
    },

    tagName: 'li',

    events: {
        'click': 'onCarClick',
        'click button': 'onDelete',
    },

    onDelete() {
        this.$el.remove();
    },

    onCarClick(e) {
        console.log('Beep beep', e.target);
    },

    render() {
        this.$el.html(this.model.get('registrationNumber'));
        this.$el.attr('data-color', this.model.get('color'));
        console.log(this.$el.data('color'))
        this.$el.append('<button>Delete</button>');
        return this;
    }
});

const carView = new CarView({ model: car });
$('body').append(carView.render().$el);

const CarsView = Backbone.View.extend({
    initialize(options) {
        this.collection.on('add', this.carAddedHandler, this);
        this.bus = options.bus;
        this.bus.on('addCar', this.addNewCar, this);
    },

    addNewCar(number) {
        const newCar = new Car({registrationNumber: number, color: "black"});
        this.carAddedHandler(newCar);
    },

    carAddedHandler(car) {
        console.log(car)
        const view = new CarView({ model: car});
        this.$el.append(view.render().$el);
    },

    events: {
        'click': 'onClick',
        'click .beep': 'onBeepClick'
    },

    onClick() {
        console.log('just clicked');
    },

    onBeepClick(e) {
        e.stopPropagation();
        console.log('beeeeep!');
    },

    render() {
        const self = this;
        this.collection.each(function(car) {
            const carView = new CarView({ model: car })
            self.$el.append(carView.render().$el);
        })
        this.$el.append('<button class="beep">Beep</button>');
    }
})

const carsView = new CarsView({el: '#cars', collection: cars, bus: bus});
carsView.render();

const NewVehicleView = Backbone.View.extend({
    initialize(options) {
        this.bus = bus;
    },

    events: {
        'click #addCarButton': 'addCarHandler',
    },

    addCarHandler() {
        console.log('click add')
        const number = this.$el.find('input').val();
        if (!number) return;

        this.bus.trigger('addCar', number);
        this.$el.find('input').val('');
    },

    render() {
        const template = _.template($('#addCarTemplate').html());
        this.$el.html(template());
        return this;
    }
});

(new NewVehicleView({ el: '#addCar'})).render()