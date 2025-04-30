# Fleet Management System

A simple application for managing vehicle fleets. This project demonstrates a layered architecture (Domain, Application, Infrastructure) and uses Node.js.

## Features

- Registering new vehicles
- Parking vehicles in a fleet

## Prerequisites

- Node.js (Version 20 or higher recommended, based on CI configuration)
- npm (Node Package Manager)

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

To start the project and run tests:

```bash
npm run start
npm run test

```

The project includes a command-line interface entry point.

To run the application

```bash
./fleet create <userId> # returns fleetId on the standard output
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]
```
