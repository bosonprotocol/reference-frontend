# Boson Protocol

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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
