[![banner](docs/assets/banner.png)](https://leptonite.io)

<h1 align="center">Leptonite - Powered by Boson Protocol</h1>

[![Gitter chat](https://badges.gitter.im/bosonprotocol.png)](https://gitter.im/bosonprotocol/community)

This is a reference application which demonstrates how to integrate Boson Protocol into a React front-end.

This reference app may be used as a template for building your own marketplace powered by Boson Protocol. Users can connect their wallets and list a set of items as a seller, as well as discover products that can be purchased as a buyer. The application also demonstrates how to the transaction lifecycle can be tracked and co-ordinated by both parties.

---
**Table of Contents**:

- [Design & Architecture](#design--architecture)
- [Local Development](#local-development)
  - [Prerequisites](#prerequisites)
  - [Build](#build)
  - [Run](#run)
- [- Note that you also need to run your own backend, configured to work with these contracts (see instructions in the reference-backend repository)](#--note-that-you-also-need-to-run-your-own-backend-configured-to-work-with-these-contracts-see-instructions-in-the-reference-backend-repository)
  - [Test](#test)
  - [Code Linting & Formatting](#code-linting--formatting)
- [Contributing](#contributing)
- [License](#license)

---
## Design & Architecture

The application architecture is as depicted below. There are various components to this:
- `Frontend`
- `Backend` (details can be found in the [`reference-backend`](https://github.com/bosonprotocol/reference-backend) repository)
    - `Server`
    - `Database`
    - `Keepers service` - These are cloud functions which run periodically to trigger certain contract methods such as expiry/finalization. Details can be found [here](https://github.com/bosonprotocol/reference-backend/tree/develop/external/keepers).
    - `Event Listeners` - This listens for blockchain events and updates the backend accordingly. Details can be found [here](https://github.com/bosonprotocol/reference-backend/tree/develop/external/lambdas).
- `Smart contracts` (details can be found in the [`contracts`](https://github.com/bosonprotocol/contracts) repository)

[![banner](docs/assets/architecture-diagram.png)](#design-&-architecture)

---
## Local Development

### Prerequisites

For local development of the reference-frontend, your development machine will need a few
tools installed. These will allow you to run the ruby scripts (executed as `./go [args]`) to build and test the project.

At a minimum, you'll need:
* Node (12.20)
* NPM (> 6)
* Ruby (2.7)
* Bundler (> 2)
* Git
* Docker
* direnv
   * This easily allows environment variables to be switched when navigating between project directories (e.g. `contracts`, `reference-backend` and `reference-frontend`). You will be prompted to run `direnv allow` to enable this.

For instructions on how to get set up with these specific versions:
* See the [OS X guide](docs/setup/osx.md) if you are on a Mac.
* See the [Linux guide](docs/setup/linux.md) if you use a Linux distribution.

---
### Build

We have a fully automated local build process to check that your changes are
good to be merged. To run the build:

```shell script
./go
````

By default, the build process fetches all dependencies, compiles, lints,
formats and tests the codebase. There are also tasks for each step. This and
subsequent sections provide more details of each of the tasks.

To fetch dependencies:

```shell script
./go dependencies:install
```

---
### Run
To run the frontend app connected to the official backend, execute the following commands from the root directory:

```shell script
npm install
npm run start
```

A browser window will open at http://localhost:3000/ with a live version of the 
code. You're all set to edit and have it rerender there.

If you need to run your own backend and want the frontend to connect it:
- create a ./.env.local file with the following variables:
  ```
  REACT_APP_BACKEND_BASE_URL="<your-backend-url>"
  REACT_APP_FRONT_END_LOCALSTORAGE_VERSION="1.0"
  GENERATE_SOURCEMAP=false
  ```
  Where <your-backend-url> is your backend url (for instance http://localhost:3333)

- Then, run:

  ```shell script
  npm install
  npm run start:local
  ```

If you need to deploy your own versions of the Boson Protocol contracts and want the frontend to connect them:
- Run ganache GUI or ganache-cli, setting block mining time to 5 second (to be sure the transactions are not going to be validated immediately)
    ```
    ganache-cli --mnemonic "one two three four five six seven eight nine ten eleven twelve" --db boson-local --port 8545 --chainId 1337 --blockTime 5
    ```
- deploy the contracts locally through Ganache (see instructions in the contracts repository)
    ```
    cd /my-repos/BosonProtocol/contracts
    npm install
    node_modules\.bin\truffle migrate
    ```
- note the addresses of the deployed contracts (or keep your window open)
- update the contract addresses in the file './src/hooks/configs.js':
  ```
  export const SMART_CONTRACTS = {
    CashierContractAddress: "0xC6fd7b3464Ffb6F3d9328aA77f836E698742B3ce",
    VoucherKernelContractAddress: "0x7589e53b8a55212Af8b3ad6ef5c31D9c02bFA25F",
    BosonRouterContractAddress: "0x81554F12c4A47bB420D5e5D51F0a8f9837Fe79C3",
    BosonTokenContractAddress: "0x518206d7aaD60874c3b2DCFfd342A2cAD828076C",
    FundLimitsContractAddress: "0xc997BC85206e436bD9e438C5Be04aaa6c679275b",
  };
  ```
- Note that you also need to run your own backend, configured to work with these contracts (see instructions in the reference-backend repository)
---
### Test

All tests are written using [Jest](https://jestjs.io/).

To run the unit tests:

```shell script
./go tests:unit
```

---
### Code Linting & Formatting

Both the app itself and the tests are linted and formatted as part of
the build process.

For the tests, we use:
* [eslint](https://eslint.org/) for linting
* [prettier](https://prettier.io/) for formatting

To lint the app:

```shell script
./go app:lint
```

This will check if the linter is satisfied. If instead you want to attempt to
automatically fix any linting issues:

```shell script
./go app:lint_fix
```

To check the formatting of the app:

```shell script
./go app:format
```

To automatically fix formatting issues:

```shell script
./go app:format_fix
```

Similarly, for the tests, to perform the same tasks:

```shell script
./go tests:lint
./go tests:lint_fix
./go tests:format
./go tests:format_fix
```

---
## Contributing

We welcome contributions! Until now, Boson Protocol has been largely worked on by a small dedicated team. However, the ultimate goal is for all of the Boson Protocol repositories to be fully owned by the community and contributors. Issues, pull requests, suggestions, and any sort of involvement are more than welcome.

If you have noticed a bug, [file an issue](/issues). If you have a large pull request, we recommend filing an issue first; small PRs are always welcome.

Questions are also welcome, as long as they are tech related. We can use them to improve our documentation.

All PRs must pass all tests before being merged.

By being in this community, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Take a look at it, if you haven't already.

---
## License

Licensed under [LGPL v3](LICENSE).
