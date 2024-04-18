# Usage

## Setup

### Clone the Repository

```
// In any folder
git clone https://github.com/yanocv/user-management-system.git
```

### Install npm Packages

```
// Go to the server directory
cd user-management-system\server

// Install dependencies
npm install
npm install ts-node nodemon --save-dev
```

### Initial Setup and Initialization

Refer to the scripts section in package.json.

```
// Initializes the database and starts the server with initial data registration
// It will take a long time to finish
npm run start:reset
```

Download the precompiled binaries from the SQLite website: https://www.sqlite.org/download.html
Choose the appropriate version based on your Windows architecture (32-bit or 64-bit)
Example: sqlite-tools-win-x64-3450200

Extract the downloaded zip file.
Copy the extracted folder to the `C:\` directory in your system.
Open terminal, and set the path: `$env:PATH += ";C:\sqlite-tools-xxx-xxx-xxxxx"`
`sqlite-tools-win-x64-3450200` is the downloaded folder name that you extracted and saved in the `C` directory.
Example: `$env:PATH += ";C:\sqlite-tools-win-x64-3450200"`

Open terminal, go to the server directory, and connect to SQLite with the following command:
`sqlite3 src\database\management.sqlite`
Then, retrieve the application ID: `SELECT application_id FROM app ORDER BY modified DESC LIMIT 1;`
Copy the ID, and paste it in: client/env/dev.js/applicationId: xxxx

### Subsequent Startups

Refer to the scripts section in package.json.

```

// Connects to the management.sqlite database stored in the project and starts the server
npm start

```
