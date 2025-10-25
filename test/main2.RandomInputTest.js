import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { assertChartData, getRandomInt, assertOutputEmployees } from "./HelperFunctions.js"

import { generateEmployeeData, getEmployeeChartContent } from "../main.js";


console.log("-----------------------------");
console.log("STARTING RANDOM INPUT TESTS!!!");
console.log("-----------------------------");

for(let i = 0;i<100;i++){
	const dtoIn = {
		count: getRandomInt(51)+50,
		age: {
			min: getRandomInt(35),
			max: getRandomInt(50)+35
		}
	};
	let employees = generateEmployeeData(dtoIn);
	test('Testing random input generated employees '+employees.length, () => {
		assertOutputEmployees(dtoIn, employees);
	});
	
	let dtoOut = getEmployeeChartContent(employees);

	test('Testing random input '+employees.length, () => {
		assertChartData(employees, dtoOut);
	});
	//TODO test 2 outputs are not same in any field
}



