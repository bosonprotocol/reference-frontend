# Reference Frontend

[![Gitter chat](https://badges.gitter.im/bosonprotocol.png)](https://gitter.im/bosonprotocol/community)

This is a reference app meant to show how to integrate Boson into a React front-end. Questions and comments encouraged!

**Table of Contents **:

- [Install and setup](#install-and-setup)
- [Front-end Doc](#front-end-doc)
  - [Offer Flow](#offer-flow)
    - [`components/NewOffer.js`](#componentsnewofferjs)
    - [Configuring input fields](#configuring-input-fields)
    - [`helpers/Dictionary.js`](#helpersdictionaryjs)
- [Contributing](#contributing)
  - [Running tests](#running-tests)
- [License](#license)

## Install and setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). To install it, clone this repo. Then, run:

```
npm install
npm run start
```

It will open a browser window at http://localhost:3000/ with a live version of the code. You're all set to edit and have it rerender there. For more run scripts, take a look at the package.json file.

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

### Running tests

Before submitting a PR, ensure that it passes the tests:

```
npm test
```

## License

Licensed under [LGPL v3](LICENSE).