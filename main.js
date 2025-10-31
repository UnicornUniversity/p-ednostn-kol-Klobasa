/**
 * The main function which calls the application. 
 * Generuje data zaměstnanců a jejich statistiky.
 * @param {object} dtoIn obsahuje počet zaměstnanců a věkové omezení zaměstnanců {min, max}
 * @returns {object} obsahuje statistiky zaměstnanců
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  let dtoOut = getEmployeeChartContent(employees);
  return dtoOut;
}

/**
 * Generuje data zaměstnanců na základě zadaných parametrů.
 * @param {object} dtoIn obsahuje počet zaměstnanců a věkové omezení zaměstnanců {min, max}
 * @returns {Array} pole zaměstnanců
 */
export function generateEmployeeData(dtoIn) {
  const maleNames = ["Ondřej", "Jiří", "Jan", "Petr", "Pavel", "Jaroslav", "David", "Ladislav", "Zdeněk", "Stanislav", "Filip", "Marek", "Vojtěch", "Daniel", "Aleš", "Radek", "Adam", "Matěj", "Dominik"];
  const femaleNames = ["Jana", "Marie", "Eva", "Anna", "Hana", "Věra", "Lenka", "Ivana", "Tereza", "Pavla", "Monika", "Zuzana", "Barbora", "Markéta", "Kristýna", "Gabriela", "Natalie", "Nikola", "Adéla", "Karolína", "Eliška"];
  const maleSurnames = ["Stolz", "Novák", "Svoboda", "Novotný", "Dvořák", "Černý", "Král", "Doležal", "Zeman", "Kolář", "Navrátil", "Čermák","Urban", "Vaněk", "Blažek", "Kříž", "Kovář"];
  const femaleSurnames = ["Nováková", "Svobodová", "Novotná", "Dvořáková", "Černá", "Králová", "Doležalová", "Zemanová", "Kolářová", "Navrátilová", "Čermáková", "Urbanová", "Vaňková", "Blažková", "Křížová", "Kovářová"];
  const workLoads = [10, 20, 30, 40];
  const dtoOut = [];

  //Generování zaměstnanců
  for (let i = 0; i < dtoIn.count; i++) {
    const isMale = Math.random() < 0.5;
    const name = isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const surname = isMale ? maleSurnames[Math.floor(Math.random() * maleSurnames.length)] : femaleSurnames[Math.floor(Math.random() * femaleSurnames.length)];
    const birthDate = generateRandomBirthDate(dtoIn.age.min, dtoIn.age.max).toISOString();
    const workLoad = workLoads[Math.floor(Math.random() * workLoads.length)];

    dtoOut.push({
      gender: isMale ? "male" : "female",
      birthdate: birthDate,
      name: name,
      surname: surname,
      workload: workLoad
    });
  }
  return dtoOut;
}

/**
 * Generuje statistiky zaměstnanců.
 * @param {Array} employees pole zaměstnanců
 * @returns {object} frekvence jmen zaměstnanců
 */
export function getEmployeeChartContent(employees) {
  let dtoOut = {
      all: {},
      male: {},
      female: {},
      femalePartTime: {},
      maleFullTime: {}
  };
  
  //Projde všechy zaměstnance a přidá jména do příslušných kategorií nebo přičte počet
  employees.forEach(employee => {

    //Všechny jména
    dtoOut.all[employee.name] = (dtoOut.all[employee.name] || 0) + 1;

    if (employee.gender === "male") {
      //Muži
      dtoOut.male[employee.name] = (dtoOut.male[employee.name] || 0) + 1;

      //Muži -  plný úvazek
      if (employee.workload == 40) {
        dtoOut.maleFullTime[employee.name] = (dtoOut.maleFullTime[employee.name] || 0) + 1;
      }

    } else {
      //Ženy
      dtoOut.female[employee.name] = (dtoOut.female[employee.name] || 0) + 1;

      //Ženy - částečný úvazek
      if (employee.workload < 40) {
        dtoOut.femalePartTime[employee.name] = (dtoOut.femalePartTime[employee.name] || 0) + 1;
      }
    }

  });

  return { names: {
    all: sortDto(dtoOut.all),
    male: sortDto(dtoOut.male),
    female: sortDto(dtoOut.female),
    femalePartTime: sortDto(dtoOut.femalePartTime),
    maleFullTime: sortDto(dtoOut.maleFullTime)
  },};
}

/**
 * Generuje náhodné datum narození v rámci zadaného věkového rozmezí.
 * @param {number} minAge Minimální věk v letech.
 * @param {number} maxAge Maximální věk v letech.
 * @returns {Date} Náhodné datum narození.
 */
function generateRandomBirthDate(minAge, maxAge) {
  // Vygenerování náhodného věku v hodinách (365,25 dní = 8766 hodin)
  const ageInHours = Math.floor(Math.random() * ((maxAge * 8766) - (minAge * 8766) + 1)) + (minAge * 8766);
  const birthDate = new Date();
  // Odečtení náhodného věku od aktuálního data
  birthDate.setHours(birthDate.getHours() - ageInHours);
  // Nastavení náhodných minut a sekund pro větší randomizaci
  birthDate.setMinutes(birthDate.getMinutes() - Math.floor(Math.random() * 60));
  birthDate.setSeconds(birthDate.getSeconds() - Math.floor(Math.random() * 60));
  return birthDate;
}

/**
 * Seřadí jména zaměstnanců podle počtu výskytů.
 * @param {object} dto jména a počet zaměstnanců
 * @returns {object} seřazená jména podle počtu zaměstnanců
 */
export function sortDto(dto) {
  return Object.fromEntries(Object.entries(dto).sort((a, b) => b[1] - a[1]));
}

//Zkušební vstup:
const dtoIn = {
  count: 10,
  age: {
    min: 19,
    max: 35,
  },
};

const result = main(dtoIn);
console.log(result);
