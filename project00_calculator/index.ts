#! /usr/bin/env node
import inquirer from "inquirer";

inquirer
  .prompt([
    {
      type: "list",
      name: "color",
      message: "Pick your Favourite Color?",
      choices: ["Red", "Blue", "Green", "Yellow"],
      default: "Red",
    },
  ])
  .then((answers: any) => {
    console.log(answers);
  })
  .catch((error: { isTtyError: any }) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      console.error(error);
    }
  });
