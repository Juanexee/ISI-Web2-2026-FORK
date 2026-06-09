export default class Vehicle {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }

    showInformation() {
        console.log(`Marca: ${this.brand}\nModelo:${this.model}\nAnio:${this.year}`);
    }

    run() {
        console.log("El vehículo está en movimiento.");
    }
}

export class Toyota extends Vehicle {
    constructor(model, year) {
        super("Toyota", model, year);
    }

    run() {
        console.log("El Toyota esta en movimiento.");
        super.run();
    }
}