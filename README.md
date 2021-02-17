## ChatRoom
![Deploy to Firebase Hosting on merge](https://github.com/JdgaleTorre/ChatRoom/workflows/Deploy%20to%20Firebase%20Hosting%20on%20merge/badge.svg)
## Table of Contents

* [Instructions](#instructions)
* [Installation](#installation)

## Instructions

Simple ChatRoom that you can connect with your Google Account.

## Installation

Clone the repository and install all dependecies

```bash
git clone git@github.com:la5ta/tally-web.git
cd chat-room-app
yarn install
```

Create the .env.local and add the variables to connect to firebase

```bash
REACT_APP_FIREBASE_KEY= "yourValue"
REACT_APP_FIREBASE_AUTHDOMAIN= "yourValue"
REACT_APP_FIREBASE_DATABASEURL= "yourValue"
REACT_APP_FIREBASE_PROJECTID= "yourValue"
REACT_APP_FIREBASE_STORAGEBUCKET= "yourValue"
REACT_APP_FIREBASE_MESSAGINGSENDERID= "yourValue"
REACT_APP_FIREBASE_APPID= "yourValue"
REACT_APP_FIREBASE_MEASUREMENTID= "yourValue"
```

And then run the app

```bash
yarn start
```