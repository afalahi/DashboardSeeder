/**
 * 
 * @param {Object[]} callbacks - Identity cloud Journey callbacks payload
 * @param {Object} inputs - callback inputs
 * @param {string} inputs.username - Username for logging or registration. Faker generates them for registration
 * @param {string} inputs.password - The password. Static value for registration
 * @param {string} inputs.givenName - Faker generates the first name for registration
 * @param {string} inputs.sn - Faker generates the last name for registration
 * @param {string} inputs.mail -Faker generates the email for registration
 * @returns {Object[]} callbacks with values
 */
export default function handleCallbacks(callbacks, inputs) {
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