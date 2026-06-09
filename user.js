export default class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    static fromJson(json) {
        const user = new User(json.name, json.age);
        return user;
    }

    showInformation() {
        console.log(`Name: ${this.name}, Age: ${this.age}`);
    }
}

export function SayHello() {
    console.log("Hello");
}