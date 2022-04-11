# This is a Forgerock Dashboard seeder to populate the dashboard with activity

## Usage

```sh
npm install -g dashseeder
```

This will install it as a global cli called seed-dashboard. The cli takes five arguments

```console
Usage: dashseeder [options] <iterations> <host> <journey>

Seed Forgerock IDC Dashboard with activity

Arguments:
  iterations           Number of logins/registrations you want the program to run
  host                 Your IDC hostname without the protocol or path e.g "host.domain.com"
  journey              The name of your journey. Current supported is default Login and Registration

Options:
  -v, --version        output the version number
  -r, --realm <realm>  The realm name (default: "alpha")
  -f, --file <file>    When provided to a registration Journey the program will store the newly created users in a json file. If no file name is provider one will be created with the name "users.json"
                   When provided to a Login Journey, the program will iterate through the users and Log them in. The format is as follows
                  [
                    {
                      "username": "Rubie68@forgeblocks.com",
                      "password": "Password@1"
                    }
                  ] (default: "users.json") (default: "users.json")
  -h, --help           Help

  Examples:
  - Run a Login iteration on a users json file
    $ dashseeder 100 https://openam-test.forgeblocks.com/am Login -r alpha -f users.json
  - Run a Registration iteration without providing a filename. Default will be 'users.json'
    $ dashseeder 100 https://openam-test.forgeblocks.com/am Registration -r alpha
  - Run a Registration Journey by providing a file name, must be a JSON formatted file
    $ dashseeder 100 https://openam-test.forgeblocks.com/am Registration -r alpha -f my-test-users.json
  - Run a Login Journey without providing a file or realm option, defaults will apply. File must exists
    $ dashseeder 100 https://openam-test.forgeblocks.com/am Login
```

### Notes

This cli will only work for The default Login and Registration Journeys. The registration Journey must be named "Registration" and the Login Journey shouldn't do more than collecting `Platform Username`, `Platform Password` and a `Data Store` decision node.

#### Journey build

Your Journeys in FIDC should resemble something like the examples below. The program can only handle basic Login and Registration Journeys

##### Registration

![Registration](/msedge_2022-04-05_18-42-19.png)

##### Login

![Login](/msedge_2022-04-05_18-43-46.png)
