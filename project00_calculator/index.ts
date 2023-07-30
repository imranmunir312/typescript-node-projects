#! /usr/bin/env node
import RS from "rxjs";
import inquirer, { QuestionAnswer } from "inquirer";
import chalk from "chalk";

const prompts = new RS.Subject<any>();

let expression: string = "";

const validateInput = (input: number): string | boolean =>
  isNaN(input) ? "Please Enter a valid Number!" : true;

function* counter(): Generator<number, void> {
  let count = 0;

  while (true) {
    yield count++;
  }
}

const count = counter();

const rxjsSubscriber = inquirer
  .prompt(prompts)
  .ui.process.subscribe(({ name, answer }: QuestionAnswer) => {
    const iteration = count.next().value;

    if (name.includes("continue") && !answer) {
      prompts.complete();
    } else if (name.includes("operator") && answer === "=") {
      console.log(
        chalk.green(`Your Answer: ${expression} = ${eval(expression)}`)
      );

      expression = "";

      prompts.next({
        type: "confirm",
        name: `continue--${iteration}`,
        message: "Do you want to continue?",
      });
    } else {
      expression += " " + answer;

      if (name.includes("number")) {
        prompts.next({
          type: "list",
          name: `operator--${iteration}`,
          message: "Operator:",
          choices: [
            {
              name: "+ (Add)",
              value: "+",
            },
            {
              name: "- (Subtract)",
              value: "-",
            },
            {
              name: "* (Multiply)",
              value: "*",
            },
            {
              name: "/ (Divide)",
              value: "/",
            },
            {
              name: "= (Equals)",
              value: "=",
            },
          ],
        });
      } else {
        prompts.next({
          type: "input",
          name: `number--${iteration}`,
          message: "Number:",
          validate: validateInput,
        });
      }
    }
  });

prompts.next({
  type: "input",
  name: "number",
  message: "Number:",
  validate: validateInput,
});

process.on("exit", () => {
  console.log(chalk.bgYellow("Thank you for using this simple calculator!"));
  rxjsSubscriber.unsubscribe();
});
