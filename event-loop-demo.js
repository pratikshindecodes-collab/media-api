import { setTimeout } from "node:timers/promises";

console.log("Start");

setTimeout(100).then(() => {
    console.log("Timer completed");
});

const end = Date.now() + 1000;

while (Date.now() < end) {

}

console.log("CPU work completed");

