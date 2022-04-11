import { faker } from '@faker-js/faker';
import axios from 'axios';
import fs from 'fs';
import chalk from 'chalk';

import handleCallbacks from './handelCallbacks.js';
/**
 *
 * @param {number} iterations
 * @param {string} service
 * @param {string} fileName
 * @param {string} hostName
 * @param {string} realmName
 */
export default function seedDashboard(
  iterations,
  hostName,
  service,
  realmName,
  fileName
) {
  const amUrl = (() => {
    try {
      const lastChar = hostName.slice(-1);
      if (lastChar !== '/') {
        return hostName + '/';
      }
      return hostName;
    } catch (err) {
      console.error(chalk.red.bold(err));
      return '';
    }
  })();
  const realm = `realms/root/realms/${realmName}`;
  const url = `json/${realm}/authenticate?authIndexType=service&authIndexValue=${service}`;

  const request = axios.create({
    baseURL: amUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept-API-Version': 'resource=2.0, protocol=1.0',
    },
  });
  request
    .request({
      method: 'post',
      url: url,
    })
    .then(res => {
      const { authId, callbacks } = res.data;
      let payload;
      let inputs;

      if (service === 'Registration') {
        const users = [];
        for (let i = 0; i < iterations; i++) {
          inputs = {
            username: faker.internet.email('', '', 'forgeblocks.com'),
            password: 'Password@1',
            givenName: faker.name.firstName(),
            sn: faker.name.lastName(),
            get mail() {
              return this.username;
            },
          };
          users[i] = inputs;
          payload = { authId, callbacks: handleCallbacks(callbacks, inputs) };
          request
            .request({
              method: 'post',
              url: url,
              data: payload,
            })
            .then(res => {
              if (res.status === 200) {
                console.log(chalk.blue(`Registered User #${users[i].username}`));
                fs.promises.writeFile(`${fileName}`, JSON.stringify(users));
              } else {
                console.error(chalk.red.bold(JSON.stringify(res.data)));
              }
            })
            .catch(err => {
              if (err.response) {
                console.error(err.response.data);
                return;
              }
            });
        }
      } else {
        if (!fs.existsSync(fileName)) {
          console.error(
            chalk.red.bold(
              'No users file exits. A users files is needed in order to count unique logins. Provide a file or run the program with Registration Journey'
            )
          );
          return;
        }
        for (let i = 0; i < iterations; i++) {
          inputs = JSON.parse(fs.readFileSync(fileName));
          payload = {
            authId,
            callbacks: handleCallbacks(callbacks, inputs[i]),
          };
          request
            .request({
              method: 'post',
              url: url,
              data: payload,
            })
            .then(res => {
              if (res.status === 200) {
                setTimeout(
                  () =>
                    console.log(
                      chalk.blue(
                        `Logged in user: ${JSON.stringify(inputs[i].username)}`
                      )
                    ),
                  5000
                );
              } else {
                console.error(chalk.red.bold(JSON.stringify(res.data)));
                return;
              }
            })
            .catch(err => {
              if (err.response) {
                console.error(
                  chalk.red.bold(JSON.stringify(err.response.data))
                );
                return;
              }
            });
        }
      }
    })
    .catch(err => {
      if (err.response) {
        console.error(chalk.red.bold(JSON.stringify(err.response.data)));
        return;
      }
    });
}
