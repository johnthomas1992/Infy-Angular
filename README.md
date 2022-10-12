# Infy-Angular
Repo for Infy-Angular assessment

## Purpose
To demonstrate the assessment provided on notification scheduler
Technologies used are Angular V13 and AWS(for backend data)

## Functionality
>FrondEnd
Based on selected market and company type, api is called and respective data containing notification dates is returned from AWS.
UI is rendered based on today's date( a constant value), with check icons if the particular date is past today's date, progress bar with number of days for next notification.
Total number of days for hardblock is also displayed after calculation.

>Backend
Mock data for different markets along with the company type is stored in AWS Lambda service.
Apis are created using AWS APIGateway service which triggers the lambda

## Installation
You need to install Node.js and then the development tools. Node.js comes with a package manager called npm for installing NodeJS applications and libraries.

Install node.js (requires node.js version >= 0.8.4)
Run `npm i` to install the packages
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Get the Code
Either clone this repository or fork it on GitHub and clone your fork:

git clone https://github.com/johnthomas1992/Infy-Angular.git
cd angular-app
