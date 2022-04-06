# This is a Forgerock Dashboard seeder to see logins and registration

## Usage

clone the repo using git

run ```npm install```

copy `.env.sample` and rename it to `.env`. Update the variable values with your own tenant info

Specify the right Journey for the script to populate Login or Registration Dashboards

```javascript
 //seedDashboard(iterations, serviceName, [username], [password])

 //Login Journey
 seedDashboard(100, 'Login', 'user.name', 'Password@1')

 //Registration Journey
 seedDashboard(100, 'Registration')
```

### Notes

This script will only work for The default Login and Registration Journeys. The registration Journey must be named "Registration" and the Login Journey shouldn't do more than collecting `Platform Username`, `Platform Password` and a `Data Store` decision node.

When specifying `Login` as an argument you must specify a username and password. The `Registration` argument will generate fake users in the system to populate the registration dashboard

#### Journey build

##### Registration

![Registration](/msedge_2022-04-05_18-42-19.png)

##### Login

![Login](/msedge_2022-04-05_18-43-46.png)
