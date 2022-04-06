const axios = require('axios').default;
require('dotenv').config()

function handleCallbacks(callbacks, inputs) {
  if (!Array.isArray(callbacks)) {
    console.error(`callbacks must be of type array`);
    return;
  }
  const { username, password, givenName, sn, mail } = inputs;
  callbacks.map(callback => {
    switch (callback.type) {
      case 'NameCallback':
        callback.input[0].value = username;
        break;
      case 'PasswordCallback':
        callback.input[0].value = password;
        break;
      case 'StringAttributeInputCallback':
        callback.output.map(output => {
          switch (output.value) {
            case 'givenName':
              callback.input[0].value = givenName;
              break;
            case 'sn':
              callback.input[0].value = sn;
              break;
            case 'mail':
              callback.input[0].value = mail;
              break;
            default:
              break;
          }
        });
      default:
        break;
    }
  });
  return callbacks;
}
function seedDashboard(
  iterations = 0,
  service = '',
  username = '',
  password = ''
) {
  const amUrl = process.env.AM_URL
  const realm = process.env.REALM;
  const request = axios.create({
    baseURL: amUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept-API-Version': 'resource=2.0, protocol=1.0',
    },
  });

  for (let i = 0; i < iterations; i++) {
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
          const { faker } = require('@faker-js/faker');
          inputs = {
            username: faker.internet.email(),
            password: 'Password@1',
            givenName: faker.name.firstName(),
            sn: faker.name.lastName(),
            get mail() {
              return this.username;
            },
          };
          payload = { authId, callbacks: handleCallbacks(callbacks, inputs) };
        } else {
          inputs = {
            username,
            password,
          };
          payload = { authId, callbacks: handleCallbacks(callbacks, inputs) };
        }
        request
          .request({
            method: 'post',
            url: `/json/${realm}/authenticate?authIndexType=service&authIndexValue=${service}`,
            data: payload,
          })
          .then(res => {
            setTimeout(() => {
              console.log(`${i} User ${service}`), 5000;
            });
          })
          .catch(err => {
            if (err.response) {
              console.error(err.response.data);
            }
          });
      })
      .catch(err => {
        if (err.response) {
          console.error(err.response.data);
        }
      });
  }
}
seedDashboard(100, 'Login', 'adam.smith@forgerock.com', 'Password@1');
