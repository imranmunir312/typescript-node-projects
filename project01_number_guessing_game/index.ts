#! /usr/bin/env node

import RS from "rxjs";
import chalk from "chalk";
import inquirer, { QuestionAnswer } from "inquirer";

const totalNumberOfAttempts: number = 3;
let guessingRange = 10;
let newScore = 0;
let highScore = 0;

const prompts = new RS.Subject<any>();

function* generateRandomNumber(max: number): Generator<number, void> {
  let previous = 0;
  while (true) {
    const next = Math.floor(Math.random() * max);
    if (previous === next) {
      continue;
    }

    previous = next;
    yield Math.floor(Math.random() * max);
  }
}

const validateInput = (input: number): string | boolean =>
  isNaN(input) || input < 0 || input > guessingRange - 1
    ? "Please Enter a valid Number!"
    : true;

function* counter(): Generator<number, void> {
  let count = 0;

  while (true) {
    yield count++;
  }
}

function* retry(attempts: number): Generator<number, void> {
  let count = attempts;

  while (count > 0) {
    yield --count;
  }
}

const count = counter();

function displayMainmenu(): void {
  const iteration = count.next().value;

  console.clear();
  console.log(chalk.bgBlue("Welcome to the Number Guessing Game!\n"));
  prompts.next({
    type: "list",
    name: `mainmenu--${iteration}`,
    message: chalk.blueBright("Main Menu:"),
    choices: [
      {
        name: "New Game",
        value: "newgame",
      },
      {
        name: "Difficulty Level",
        value: "difficulty",
      },
      {
        name: "High Score",
        value: "highscore",
      },
      {
        name: "Exit",
        value: "exit",
      },
    ],
  });
}

function displayRemainingAttempts(
  totalAttempts: number,
  remainingAttempts: number
): void {
  console.clear();
  console.log(
    chalk.bgYellow(
      ` Remaining Attempts: ${Array.from({ length: totalAttempts })
        .fill("❤️", 0, remainingAttempts)
        .fill("🩶", remainingAttempts)
        .join(" ")}  \t\t\t`
    ),
    chalk.bgMagentaBright(` Your Score: ${newScore} \n`)
  );
}

function promptNumberInput(): void {
  const iteration = count.next().value;

  prompts.next({
    type: "input",
    name: `guess--${iteration}`,
    message: chalk.blueBright(
      `Guess a number between 0 and ${guessingRange - 1}:`
    ),
    validate: validateInput,
  });
}

function promptDifficulty(): void {
  const iteration = count.next().value;

  console.clear();
  console.log(chalk.bgBlue("Select Difficulty Level:\n"));

  prompts.next({
    type: "list",
    name: `difficulty--${iteration}`,
    message: chalk.blueBright("Difficulty Level:"),
    choices: [
      {
        name: "Easy",
        value: "easy",
      },

      {
        name: "Medium",
        value: "medium",
      },
      {
        name: "Hard",
        value: "hard",
      },
    ],
    default:
      guessingRange === 10 ? "easy" : guessingRange === 100 ? "medium" : "hard",
  });
}

function backToMainMenu(): void {
  const iteration = count.next().value;

  console.log(chalk.bgYellow("\nReturning to MainMenu!\n"));

  prompts.next({
    type: "confirm",
    name: `backtomenu--${iteration}`,
    message: chalk.blueBright("Do you want to return to main menu?"),
  });
}

let generateNumber = generateRandomNumber(guessingRange);
let randomNumber = generateNumber.next().value;
let retryCount = retry(totalNumberOfAttempts);

const subscriber: RS.Subscription = inquirer
  .prompt(prompts)
  .ui.process.subscribe(({ name, answer }: QuestionAnswer) => {
    const questionName = name.split("--")[0];

    switch (questionName) {
      case "mainmenu":
        switch (answer) {
          case "newgame":
            randomNumber = generateNumber.next().value;
            retryCount = retry(totalNumberOfAttempts);

            displayRemainingAttempts(
              totalNumberOfAttempts,
              totalNumberOfAttempts
            );

            newScore = 0;

            promptNumberInput();
            break;

          case "difficulty":
            promptDifficulty();
            break;

          case "highscore":
            console.log(chalk.green(`High Score: ${highScore}`));

            backToMainMenu();
            break;

          case "exit":
            console.log(chalk.red("\nThank you for playing!"));
            prompts.complete();
        }

        break;

      case "backtomenu":
        if (answer) {
          displayMainmenu();
        } else {
          backToMainMenu();
        }

        break;
      case "difficulty":
        switch (answer) {
          case "easy":
            guessingRange = 10;
            console.log(chalk.green("Difficulty Level set to Easy!"));
            break;
          case "medium":
            guessingRange = 100;
            console.log(chalk.green("Difficulty Level set to Medium!"));
            break;
          case "hard":
            guessingRange = 1000;
            console.log(chalk.green("Difficulty Level set to Hard!"));
            break;
        }

        generateNumber = generateRandomNumber(guessingRange);
        randomNumber = generateNumber.next().value;

        backToMainMenu();
        break;

      case "guess":
        const guess = parseInt(answer);
        const attempts = retryCount.next().value;

        if (guess === randomNumber) {
          console.clear();
          console.log(chalk.green("You guessed it right!"));
          console.log(chalk.bgCyanBright("Guess New Number to Continue!"));

          newScore += 5;

          if (newScore > highScore) {
            highScore = newScore;
          }

          randomNumber = generateNumber.next().value;

          const newAttempt =
            attempts !== undefined
              ? attempts + 2 > totalNumberOfAttempts
                ? totalNumberOfAttempts
                : attempts + 2
              : 1;
          retryCount = retry(newAttempt);

          displayRemainingAttempts(totalNumberOfAttempts, newAttempt);

          promptNumberInput();
        } else {
          displayRemainingAttempts(totalNumberOfAttempts, attempts || 0);

          if (!attempts) {
            console.clear();
            console.log(chalk.red("You have exceeded the number of attempts!"));
            console.log(chalk.red(`The correct answer is ${randomNumber}`));
            console.log(chalk.red("Game Over!"));
            console.log(chalk.bgCyanBright(`\nYour Score: ${newScore}\n`));
            console.log(chalk.yellow("Returning to main menu"));

            backToMainMenu();
          } else {
            console.log(chalk.red("You guessed it wrong!"));

            promptNumberInput();
          }
        }

        break;
    }
  });

displayMainmenu();

process.on("exit", () => {
  console.log(
    chalk.magentaBright("Thank you for using this playing this game 👋!")
  );
  subscriber.unsubscribe();
});
