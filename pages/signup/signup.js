import Vehicle, { Toyota } from "../../shared/models/vehicle.js";

const corolla = new Toyota("Corolla", 2026);
console.log(corolla);
corolla.showInformation();
corolla.run();