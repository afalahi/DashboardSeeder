import { faker } from '@faker-js/faker';
import axios from 'axios';
import fs from 'fs';

import handleCallbacks from './handelCallbacks.js';
/**
 *
 * @param {number} iterations
 * @param {string} service
 * @param {string} fileName
 * @param {string} hostName
 * @param {string} realmName
 */
function seedDashboard(iterations, service, fileName, hostName, realmName) {
  const amUrl = (() => {
    try {
      const getHost = new RegExp(
        "^[a-z][a-z0-9+-.]*://([a-z0-9-._~%!$&'()*+,;=]+@)?([a-z0-9-._~%]+|[[a-z0-9-._~%!$&'()*+,;=:]+])"
      ).exec(hostName);
      if (getHost === null) {
        if (hostName.slice(hostName.lastIndexOf('/')) !== '/am') {
          console.error('This function only works with forgerock cloud');
          return;
        } else {
          hostName = hostName.slice(
            -hostName.length,
            hostName.lastIndexOf('/')
          );
        }
        return `https://${hostName}/am`;
      }
      return `https://${getHost[2]}/am`;
    } catch (err) {
      throw new Error(
        `The hostname: ${hostName} you entered is invalid. Please use format 'host.domain.tld'`
      );
    }
  })();
  const realm = `realms/root/realms/${realmName}`;

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
      url: `/json/${realm}/authenticate?authIndexType=service&authIndexValue=${service}`,
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
          payload = { authId, callbacks: handleCallbacks(callbacks, inputs) };
          request
            .request({
              method: 'post',
              url: `/json/${realm}/authenticate?authIndexType=service&authIndexValue=${service}`,
              data: payload,
            })
            .catch(err => {
              if (err.response) {
                console.log(err.response.data);
              }
            });
          users[i] = inputs;
          console.log(`Registered User #${i}`);
        }
        if (fileName) {
          fs.promises.writeFile(`${fileName}`, JSON.stringify(users));
        }
      } else {
        if (!fs.existsSync(fileName)) {
          console.error(
            'No users file exits. A users files is needed in order to count unique logins'
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
              url: `/json/${realm}/authenticate?authIndexType=service&authIndexValue=${service}`,
              data: payload,
            })
            .then(res => {
              console.log(`Logged in user: ${inputs[i].username}`);
            })
            .catch(err => {
              if (err.response) {
                console.error(err.response.data);
              }
            });
        }
      }
    })
    .catch(err => {
      if (err.response) {
        console.error(err.response.data);
      }
    });
}