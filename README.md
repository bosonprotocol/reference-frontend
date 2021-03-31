[![banner](docs/assets/banner.png)](https://bosonprotocol.io)

<h1 align="center">Boson Protocol Reference Frontend</h1>

![](https://img.shields.io/badge/Coverage-7%25-733B27.svg?prefix=$coverage$)
[![Gitter chat](https://badges.gitter.im/bosonprotocol.png)](https://gitter.im/bosonprotocol/community)

This is a reference app meant to show how to integrate Boson into a React front-end. Questions and comments encouraged!

**Table of Contents**:

- [Local Development](#local-development)
- [Testing](#testing)
- [Code Linting](#code-linting)
- [Front-end Doc](#front-end-doc)
  - [Offer Flow](#offer-flow)
    - [`components/NewOffer.js`](#componentsnewofferjs)
    - [Configuring input fields](#configuring-input-fields)
    - [`helpers/Dictionary.js`](#helpersdictionaryjs)
- [Contributing](#contributing)
- [License](#license)

## Local Development

### Prerequisites

For local development of the reference-backend, your development machine will need a few
tools installed.

At a minimum, you'll need:
* Node (12.20)
* NPM (> 6)
* Ruby (2.7)
* Bundler (> 2)
* Git
* Docker
* direnv

For instructions on how to get set up with these specific versions:
* See the [OS X guide](docs/setup/osx.md) if you are on a Mac.
* See the [Linux guide](docs/setup/linux.md) if you use a Linux distribution.

### Running the app locally

To run the app, run the following:

```shell script
npm install
npm run start
```

A browser window will open at http://localhost:3000/ with a live version of the 
code. You're all set to edit and have it rerender there.

### Running the build

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

## Testing

All tests are written using [Jest](https://jestjs.io/).

To run the unit tests:

```shell script
./go tests:unit
```

## Code Linting

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

## Front-end Doc

### Offer Flow

The flow is using context (and will use localstorage) for state management.

#### `components/NewOffer.js`
This is where the the form is registered and its' data is navigated.

'screens' defines the order of the screens

The function 'updateData' will send an object with property: value of the field changed and its' value.

On activeScreen change, we fire useEffect, which will bind event listener (which is either 'input' or 'change') to the active input fields.

The component returns TOP NAVIGATION, SCREEN, and BOTTOM NAVIGATION. SCREEN is dynamic.

#### Configuring input fields
To change, add, or remove an input field:
1. Refer to desired screen (defined in 'screens' constant)
2. When making changes - make sure the field has a 'name' attribute. Assign a corresponding property in the 'NAME' object in 'helpers/Dictionary.js'.
-If you are removing a field - remove its' property from 'NAME'
-If you want to store the field's value in the context - assign a new property in 'NAME' and bind it to the field's name attribute.


#### `helpers/Dictionary.js`
'NAME' object is assigned to context and used to store data from the form. If you modify the fields here, there is no need to update any other logic, for the submission to work fine.

## Contributing

We welcome contributions! Until now, Boson Protocol has been largely worked on by a small dedicated team. However, the ultimate goal is for all of the Boson Protocol repositories to be fully owned by the community and contributors. Issues, pull requests, suggestions, and any sort of involvement are more than welcome.

If you have noticed a bug, [file an issue](/issues). If you have a large pull request, we recommend filing an issue first; small PRs are always welcome.

Questions are also welcome, as long as they are tech related. We can use them to improve our documentation.

All PRs must pass all tests before being merged.

By being in this community, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Take a look at it, if you haven't already.

## License

Licensed under [LGPL v3](LICENSE).
