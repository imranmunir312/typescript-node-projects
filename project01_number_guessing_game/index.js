#! /usr/bin/env node
import RS from "rxjs";
import chalk from "chalk";
import inquirer from "inquirer";
const prompts = new RS.Subject();
const subscriber = inquirer
    .prompt(prompts)
    .ui.process.subscribe(({ name, answer }) => { });
process.on("exit", () => {
    chalk.red("exit");
});
