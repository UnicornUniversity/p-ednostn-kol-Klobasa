import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { assertChartData, assertOutputEmployees } from "./HelperFunctions.js"

import { generateEmployeeData, getEmployeeChartContent } from "../main.js";


console.log("-----------------------------");
console.log("STARTING BASIC INPUT TESTS!!!");
console.log("-----------------------------");

const dtoIn = {
  count: 50,
  age: {
    min: 19,
    max: 35
  }
};

let employees = generateEmployeeData(dtoIn);
let dtoOut = getEmployeeChartContent(employees);

test('Testing random input generated employees '+employees.length, () => {
	assertOutputEmployees(dtoIn, employees);
});

test('Testing basic input '+employees.length, () => {
	assertChartData(employees, dtoOut);
});


