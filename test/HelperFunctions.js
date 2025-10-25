import { test, describe } from "node:test";
import { strict as assert } from "node:assert";

//Tolerance for min and maximum of birthdate in years
const DATE_TOLERACE = 1/12;

// true = person age must be in <age.min, age.max> interval, 
// false = person age must be in <age.min, age.max + 1 year) interval
const USE_CLOSED_INTERVAL_FOR_DATE = true;

//Maximal number of names/surnames (male+female together)
const MAXIMUM_NAMES = 50;
//Minimal number of names/surnames (male+female together)
const MINIMUM_NAMES = 8;

// true = we require only one from names/chartData in dtoOut - it is not necessary to have both
// false = both names and chartData are required
const AT_LEAST_ONE_OUTPUT = true;

// if we require data about first name counts ("charts") to be sorted
// true = data must be sorted descendingly
// false = we do not expect any sorting
const REQUIRE_CHARTS_SORTED = true;
/**
 *
 * @param dtoOut
 * @param dtoIn
 */
export function assertBasicStructureEmployees(dtoIn, dtoOut) {
	//dtoIn properties
	assert(dtoIn.hasOwnProperty('count'), 'Testing that dtoIn properties are not deleted - count');
	assert(dtoIn.hasOwnProperty('age'), 'Testing that dtoIn properties are not deleted - age');
	assert(dtoIn.age.hasOwnProperty('min'), 'Testing that dtoIn properties are not deleted - age.min');
	assert(dtoIn.age.hasOwnProperty('max'), 'Testing that dtoIn properties are not deleted - age.max');
	
	//dtoOut properties
	assert(Array.isArray(dtoOut), 'Testing that dtoOut properties - dtoOut is an array');
		assert(dtoOut.length === dtoIn.count, 'Testing basic input - output person count of '+dtoOut.length +'is equal input count '+dtoIn.count);
	
	for(let i =0;i<dtoOut.length;i++){
		const person = dtoOut[i];
		assert(person.hasOwnProperty('gender'), 'Testing that dtoOut properties exist - gender');
		assert(person.hasOwnProperty('workload'), 'Testing that dtoOut properties exist - workload');
		assert(person.hasOwnProperty('name'), 'Testing that dtoOut properties exist - name');
		assert(person.hasOwnProperty('surname'), 'Testing that dtoOut properties exist - surname');
		assert(person.hasOwnProperty('birthdate'), 'Testing that dtoOut properties exist - birthdate');
	}
}

/**
 *
 * @param dtoOut
 */
export function assertChartStructure(dtoOut) {
	
	if(dtoOut.hasOwnProperty('names')){
		assert(dtoOut.names.hasOwnProperty('all'), 'Testing chart data - testing that names.all object exist');
		assert(dtoOut.names.hasOwnProperty('male'), 'Testing chart data - testing that names.male object exist');
		assert(dtoOut.names.hasOwnProperty('female'), 'Testing chart data - testing that names.female object exist');
		assert(dtoOut.names.hasOwnProperty('femalePartTime'), 'Testing chart data - testing that names.femalePartTime object exist');
		assert(dtoOut.names.hasOwnProperty('maleFullTime'), 'Testing chart data - testing that names.maleFullTime object exist');
		
		for(const [groupName, group] of Object.entries(dtoOut.names)){
			for(const [key, value] of Object.entries(group)){
				
				assert(isString(key), 'Testing chart data - testing that names.'+groupName+'.'+key+' is proper name');
				assert(key.trim().length>1, 'Testing chart data - testing that names.'+groupName+'.'+key+' has at least 2 characters');
				
				assert(Number.isInteger(value), 'Testing chart data - testing that names.'+groupName+'.'+key+' ('+value+') is integer number');
				assert(value>=0, 'Testing chart data - testing that names.'+groupName+'.'+key+' ('+value+') is not negative');
			}
		}
	} else {
		if(!AT_LEAST_ONE_OUTPUT) 
			assert(dtoOut.hasOwnProperty('names'), 'Testing chart data - testing that names object exist');
	}
	
	if(dtoOut.hasOwnProperty('chartData')){
		
		assert(dtoOut.chartData.hasOwnProperty('all'), 'Testing chart data - testing that chartData.all object exist');
		assert(dtoOut.chartData.hasOwnProperty('male'), 'Testing chart data - testing that chartData.male object exist');
		assert(dtoOut.chartData.hasOwnProperty('female'), 'Testing chart data - testing that chartData.female object exist');
		assert(dtoOut.chartData.hasOwnProperty('femalePartTime'), 'Testing chart data - testing that chartData.femalePartTime object exist');
		assert(dtoOut.chartData.hasOwnProperty('maleFullTime'), 'Testing chart data - testing that chartData.maleFullTime object exist');
		
		for(const [groupName, group] of Object.entries(dtoOut.chartData)){
			
			assert(Array.isArray(group), 'Testing chart data - testing that chartData.'+groupName+' is array');
			for(const namePair of group){
				
				assert(namePair.hasOwnProperty('label'), 'Testing chart data - testing that chartData.'+groupName+' has label');
				assert(isString(namePair.label), 'Testing chart data - testing that chartData.'+groupName+' - '+namePair.label+' is proper name');
				assert(namePair.label.trim().length>1, 'Testing chart data - testing that chartData.'+groupName+' - '+namePair.label+' has at least 2 characters');
				
				assert(namePair.hasOwnProperty('value'), 'Testing chart data - testing that chartData.'+groupName+' has value');
				assert(Number.isInteger(namePair.value), 'Testing chart data - testing that chartData.'+groupName+'.'+namePair.label+' ('+namePair.value+') is integer number');
				assert(namePair.value>=0, 'Testing chart data - testing that chartData.'+groupName+'.'+namePair.label+' ('+namePair.value+') is not negative');
			}
		}
		
	} else {
		if(!AT_LEAST_ONE_OUTPUT) 
			assert(dtoOut.hasOwnProperty('chartData'), 'Testing chart data - testing that chartData object exist');
	}
	
	assert(dtoOut.hasOwnProperty('names') || dtoOut.hasOwnProperty('chartData'), 'Testing chart data - testing that at least one of names/chartData exists');
}

/**
 *
 * @param dtoOut
 * @param dtoIn
 */
export function assertOutputEmployees(dtoIn, dtoOut) {
	//tests basic structure of input+output is correct
	assertBasicStructureEmployees(dtoIn, dtoOut);
	
	const names = {};
	const surnames = {};
	const dates = {};
	const workloads = {};
	const sexes = {};
	for(let i =0;i<dtoOut.length;i++){
		const person = dtoOut[i];
	  
		assert(["male", "female"].includes(person.gender), 'Testing basic input - permitted gender (sex) value of '+person.gender);
	  	assert([10, 20, 30, 40].includes(person.workload), 'Testing basic input - permitted workload value of '+person.workload);
	  
		sexes[person.gender] = ++sexes[person.gender] || 1;
	  	names[person.name] = ++names[person.name] || 1;
		surnames[person.surname] = ++surnames[person.surname] || 1;
		workloads[person.workload] = ++workloads[person.workload] || 1;
		dates[person.birthdate] = ++dates[person.birthdate] || 1;
		
		let date = parseISOString(person.birthdate);
		assertDate(date, dtoIn);
	}
	
	//testing right count - should not fail
	assert(Object.values(sexes).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has sex');
	assert(Object.values(dates).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has date');
	assert(Object.values(workloads).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has workload');
	assert(Object.values(names).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has name');
	assert(Object.values(surnames).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has surname');


  
  //testing usage of all/proper count of options
	assert(Object.keys(workloads).length === 4, 'Testing basic input - Testing that all options for every workload is used');
	assert(Object.keys(sexes).length === 2, 'Testing basic input - Testing that all options for every sex (gender) is used');
	assert(Object.keys(names).length>=MINIMUM_NAMES, 'Testing basic input - Testing that at least '+MINIMUM_NAMES+' names are used');
	assert(Object.keys(surnames).length>=MINIMUM_NAMES, 'Testing basic input - Testing that at least '+MINIMUM_NAMES+' surnames are used');
	assert(Object.keys(names).length<=MAXIMUM_NAMES, 'Testing basic input - Testing that no more than '+MAXIMUM_NAMES+' names are used');
	assert(Object.keys(surnames).length<=MAXIMUM_NAMES, 'Testing basic input - Testing that no more than '+MAXIMUM_NAMES+' surnames are used');
	assert(Object.keys(dates).length===dtoIn.count, 'Testing basic input - Testing that every person has a different birthdate');
}



/**
 *
 * @param date
 * @param dtoIn
 */
export function assertDate(date, dtoIn) {
  	const now = new Date();
    const years = (now - date)/(1000*60*60*24*365.25);
	
	assert(years+(DATE_TOLERACE)>=dtoIn.age.min, 'Testing basic input - Testing that person born in '+date.toISOString()+", i.e. "+years+" y.o., is older than "+dtoIn.age.min);
	if(USE_CLOSED_INTERVAL_FOR_DATE)
		assert(years-(DATE_TOLERACE)<=dtoIn.age.max, 'Testing basic input - Testing that person born in '+date.toISOString()+", i.e. "+years+" y.o., is younger than "+dtoIn.age.max);
	else
		assert(years-(DATE_TOLERACE)<dtoIn.age.max+1, 'Testing basic input - Testing that person born in '+date.toISOString()+", i.e. "+years+" y.o., is younger than "+dtoIn.age.max);
}


//YYYY-MM-DDTHH:mm:ss.sssZ
//i.e. "2000-01-03T00:00:00.000Z"
/**
 *
 * @param isoString
 */
export function parseISOString(isoString){
	assert(isoString.length === 24, 'Testing basic input - testing date character size of '+isoString+' is 24 (is '+isoString.length+')!');
	
	//year
	let year = isoString.substring(0, 4);
	assert(Number.isInteger(+year), 'Testing basic input - testing date year is a number: '+year+" in "+isoString+" int value: "+ (+year));
	assert(+year > 0, 'Testing basic input - testing date year is in AD: '+year+" in "+isoString+" int value: "+ (+year));
	assert(+year <= (new Date()).getFullYear(), 'Testing basic input - testing date year is not in future: '+year+" in "+isoString+" int value: "+ (+year));
	
	//separators
	assert(isoString.charAt(4)==='-', 'Testing basic input - testing date separator "-" on index 4 in '+isoString);
	assert(isoString.charAt(7)==='-', 'Testing basic input - testing date separators "-" on index 7 in '+isoString);
	assert(isoString.charAt(10)==='T', 'Testing basic input - testing date separators "T" on index 10 in '+isoString);
	assert(isoString.charAt(13)===':', 'Testing basic input - testing date separators ":" on index 13 in '+isoString);
	assert(isoString.charAt(16)===':', 'Testing basic input - testing date separators ":" on index 16 in '+isoString);
	assert(isoString.charAt(19)==='.', 'Testing basic input - testing date separators "." on index 19 in '+isoString);
	assert(isoString.charAt(23)==='Z', 'Testing basic input - testing date separators "Z" on index 23 in '+isoString);
	
	//month
	let monthString = isoString.substring(5, 7);
	let intMonth = +monthString;
	assert(Number.isInteger(+monthString), 'Testing basic input - testing date month is a number: '+monthString+" in "+isoString+" int value: "+ (+monthString));
	assert(intMonth > 0, 'Testing basic input - testing date month is > 0: '+monthString+" in "+isoString+" int value: "+ (+monthString));
	assert(intMonth < 13, 'Testing basic input - testing date month is < 13: '+monthString+" in "+isoString+" int value: "+ (+monthString));
	let month = monthString-1;//month sould be index
	
	//day
	let day = isoString.substring(8, 10);
	assert(Number.isInteger(+day), 'Testing basic input - testing date day is a number: '+day+" in "+isoString+" int value: "+ (+day));
	assert(+day > 0, 'Testing basic input - testing date day > 0: '+day+" in "+isoString+" int value: "+ (+day));
	assert(!isNaN(new Date(+year, +month, +day)), 'Testing basic input - testing date day is a valid day in month and year: '+day+" in "+isoString+" int value: "+ (+day));

	//hout
	let hour = isoString.substring(11, 13);
	assert(Number.isInteger(+hour), 'Testing basic input - testing date hour is a number: '+hour+" in "+isoString+" int value: "+ (+hour));
	assert(+hour >= 0, 'Testing basic input - testing date hour >= 0: '+hour+" in "+isoString+" int value: "+ (+hour));
	assert(+hour <= 24, 'Testing basic input - testing date hour <= 24: '+hour+" in "+isoString+" int value: "+ (+hour));
	
	//minutes
	let minute = isoString.substring(14, 16);
	assert(Number.isInteger(+minute), 'Testing basic input - testing date minute is a number: '+minute+" in "+isoString+" int value: "+ (+minute));
	assert(+minute >= 0, 'Testing basic input - testing date minute >= 0: '+minute+" in "+isoString+" int value: "+ (+minute));
	assert(+minute <= 60, 'Testing basic input - testing date minute <= 60: '+minute+" in "+isoString+" int value: "+ (+minute));
	
	//second
	let second = isoString.substring(17, 19);
	assert(Number.isInteger(+second), 'Testing basic input - testing date second is a number: '+second+" in "+isoString+" int value: "+ (+second));
	assert(+second >= 0, 'Testing basic input - testing date second >= 0: '+second+" in "+isoString+" int value: "+ (+second));
	assert(+second <= 60, 'Testing basic input - testing date second <= 60: '+second+" in "+isoString+" int value: "+ (+second));

	//ms
	let milisecond = isoString.substring(20, 23);
	assert(Number.isInteger(+milisecond), 'Testing basic input - testing date milisecond is a number: '+milisecond+" in "+isoString+" int value: "+ (+milisecond));
	assert(+milisecond >= 0, 'Testing basic input - testing date milisecond >= 0: '+milisecond+" in "+isoString+" int value: "+ (+milisecond));
	assert(+milisecond <= 999, 'Testing basic input - testing date milisecond <= 999: '+milisecond+" in "+isoString+" int value: "+ (+milisecond));

	//valid date
	const date = new Date(+year, +month, +day, +hour, +minute, +second, +milisecond);
	assert(!isNaN(date), 'Testing basic input - testing date correct format of '+isoString);
	
	return date;
}

export function compareEmpoyeeLists(testedList, expectedList){
	assert(testedList.length === expectedList.length, 'Comparing employee lists - length '+testedList.length+' should be '+expectedList.length);
	
	for(let i = 0;i < expectedList.length;i++){
		assert(testedList[i].workload === expectedList[i].workload, 'Comparing employee lists - workload '+testedList[i].workload+' is not '+expectedList[i].workload);
		assert(testedList[i].name === expectedList[i].name, 'Comparing employee lists - name '+testedList[i].name+' is not '+expectedList[i].name);
		assert(testedList[i].surname === expectedList[i].surname, 'Comparing employee lists - surname '+testedList[i].surname+' is not '+expectedList[i].surname);
		assert(testedList[i].gender === expectedList[i].gender, 'Comparing employee lists - gender '+testedList[i].gender+' is not '+expectedList[i].gender);
		assert(testedList[i].birthdate === expectedList[i].birthdate, 'Comparing employee lists - birthdate '+testedList[i].birthdate+' is not '+expectedList[i].birthdate);
	}
}

export function assertChartData(employees, dtoOut) {
	assertChartStructure(dtoOut);
	
	let allNames = {}, females = {}, males = {}, femalePartTime = {}, maleFullTime = {};
	
	for(let i = 0;i<employees.length;i++){
		const person = employees[i];
		allNames[person.name] = ++allNames[person.name] || 1;
		if(person.gender === "male"){
			males[person.name] = ++males[person.name] || 1;
			if(person.workload === 40){
				maleFullTime[person.name] = ++maleFullTime[person.name] || 1;
			}
		} else {
			females[person.name] = ++females[person.name] || 1;
			if(person.workload !== 40){
				femalePartTime[person.name] = ++femalePartTime[person.name] || 1;
			}
		}
	}
	
	assertNameGroup("all", getSortedDictionaryAsPairArrayDesc(allNames), dtoOut?.names?.all ?? null, dtoOut?.chartData?.all ?? []);
	assertNameGroup("male", getSortedDictionaryAsPairArrayDesc(males), dtoOut?.names?.male ?? null, dtoOut?.chartData?.male ?? []);
	assertNameGroup("female", getSortedDictionaryAsPairArrayDesc(females), dtoOut?.names?.female ?? null, dtoOut?.chartData?.female ?? []);
	assertNameGroup("maleFullTime", getSortedDictionaryAsPairArrayDesc(maleFullTime), dtoOut?.names?.maleFullTime ?? null, dtoOut?.chartData?.maleFullTime ?? []);
	assertNameGroup("femalePartTime", getSortedDictionaryAsPairArrayDesc(femalePartTime), dtoOut?.names?.femalePartTime ?? null, dtoOut?.chartData?.femalePartTime ?? []);
}

export function assertNameGroup(groupName, expectedNames, names, chartData) {
	const namesPairArray = names === null ? [] : Object.entries(names);
	
	assert(namesPairArray.length === expectedNames.length || namesPairArray.length === 0, "Testing chart values - names."+groupName+" has wrong count of "+namesPairArray.length+" expected "+expectedNames.length);
	assert(chartData.length === expectedNames.length || chartData.length === 0, "Testing chart values - chartData."+groupName+" has wrong count of "+chartData.length+" expected "+expectedNames.length);
	assert(chartData.length === expectedNames.length || namesPairArray.length === expectedNames.length, "Testing chart values - chartData."+groupName+" and names."+groupName+" has wrong count of "+chartData.length+", "+namesPairArray.length+" expected "+expectedNames.length);
	
	
	for(let i = 0;i < expectedNames.length;i++){
		const [expectedName, expectedCount] = expectedNames[i];
		
		//names
		if(namesPairArray.length !== 0){
			assert(names.hasOwnProperty(expectedName), "Testing chart values - names."+groupName+" has "+expectedName);
			assert(names[expectedName]===expectedCount, "Testing chart values - names."+groupName+"."+expectedName+" has count"+names[expectedName]+" expected "+expectedCount);
			
			if(REQUIRE_CHARTS_SORTED) {
				const [name, value] = namesPairArray[i];
				
				assert(name===expectedName, "Testing chart values - names."+groupName+"."+expectedName+" sorted at index "+i+" but at this index is name "+name);
				assert(value===expectedCount, "Testing chart values - names."+groupName+"."+expectedName+" count "+expectedCount+" at index "+i+" but item at this index has value "+value+"! There could be duplicity in name.");
			}
		}
		
		//chartData
		if(chartData.length !== 0){
			//this is in O(n^2) - is it necessary to rewrite?
			let chartPair = chartData.find(pair => pair.label === expectedName);			
			assert(chartPair.value===expectedCount, "Testing chart values - chartData."+groupName+"."+expectedName+" has count"+chartPair.value+" expected "+expectedCount);
			
			if(REQUIRE_CHARTS_SORTED) {
				chartPair = chartData[i];
				
				assert(chartPair.label===expectedName, "Testing chart values - chartData."+groupName+"."+expectedName+" sorted at index "+i+" but at this index is name "+chartPair.label);
				assert(chartPair.value===expectedCount, "Testing chart values - chartData."+groupName+"."+expectedName+" count "+expectedCount+" at index "+i+" but item at this index has value "+chartPair.value+"! There could be duplicity in name.");
			}
		}
		
	}
}

export function getSortedDictionaryDesc(dictionary){
	return Object.fromEntries(Object.entries(dictionary).sort(([,a],[,b]) => b-a));
}
export function getSortedDictionaryAsPairArrayDesc(dictionary){
	return Object.entries(dictionary).sort(([,a],[,b]) => b-a);
}

/**
 *
 * @param max
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function isString(value) {
	return typeof value === 'string' || value instanceof String;
}