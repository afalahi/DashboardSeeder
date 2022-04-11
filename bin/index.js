#! /usr/bin/env node --experimental-json-modules --no-warnings

import { Command } from 'commander';

import seedDashboard from '../dashboardSeed.js';
import pkg from '../package.json' assert {type: "json"};

const program = new Command();

program
  .name(pkg.name)
  .description('Seed Forgerock IDC Dashboard with activity')
  .version(`v${pkg.version} [node: ${process.version}]`, '-v, --version');

(async () => {
  try {
    program
      .helpOption('-h, --help', 'Help')
      .argument(
        '<iterations>',
        'Number of logins/registrations you want the program to run'
      )
      .argument(
        '<host>',
        'Your IDC am url e.g "https://host.domain.com/am"'
      )
      .argument(
        '<journey>',
        'The name of your journey. Current supported is default Login and Registration'
      )
      .option('-r, --realm <realm>', 'The realm name', 'alpha')
      .option(
        '-f, --file <file>',
        `When provided to a registration Journey the program will store the newly created users in a json file. If no file name is provider one will be created with the name "users.json"
                 When provided to a Login Journey, the program will iterate through the users and Log them in. The format is as follows
                [
                  {
                    "username": "Rubie68@forgeblocks.com",
                    "password": "Password@1"
                  }
                ] (default: "users.json")`,
        'users.json'
      )
      .action((iterations, host, journey, options) => {
        seedDashboard(iterations, host, journey, options.realm, options.file);
      });
    program.parse();
  } catch (err) {
    console.error('Error: Exception running dashseeder - ', err);
  }
})();
