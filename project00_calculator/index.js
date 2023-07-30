#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import chalk from "chalk";
const validateNumber = (input) => {
    const number = parseInt(input);
    if (!isNaN(number)) {
        return true;
    }
    return "ReEnter Number";
};
const calculate = ({ firstNum, secondNum, operator, }) => {
    switch (operator) {
        case "+ (add)":
            return parseInt(firstNum) + parseInt(secondNum);
        case "- (minus)":
            return parseInt(firstNum) - parseInt(secondNum);
        case "/ (divide)":
            return parseInt(firstNum) / parseInt(secondNum);
        case "x (multiply)":
            return parseInt(firstNum) * parseInt(secondNum);
        default:
            return "invalid operator";
    }
};
const calculator = () => __awaiter(void 0, void 0, void 0, function* () {
    const values = yield inquirer.prompt([
        {
            name: "firstNum",
            type: "input",
            message: "Enter your First number:",
            validate: validateNumber,
        },
        {
            name: "secondNum",
            type: "number",
            message: "Enter your Second Number:",
            validate: validateNumber,
        },
        {
            name: "operator",
            type: "list",
            choices: ["+ (add)", "- (minus)", "/ (divide)", "x (multiply)"],
            message: "Choose operator",
        },
    ]);
    console.log(chalk.blue("Your Answer is: ", calculate(values)));
    yield promptMoreCalculation();
});
const promptMoreCalculation = () => __awaiter(void 0, void 0, void 0, function* () {
    const { toBeContinue, } = yield inquirer.prompt([
        {
            name: "toBeContinue",
            type: "confirm",
            message: "Do you want to perform more actions",
        },
    ]);
    if (toBeContinue === true) {
        yield calculator();
    }
    else
        console.log(chalk.blue("Have a Nice Day!"));
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield calculator();
}))();
