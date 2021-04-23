import cities from "./city.json"
import countries from "./country.json"

export const DEFAULT_COUNTRY_IS_CODE = countries[0].isoCode

const compare = (a, b) => {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}; 

export const defaultCountyName = () => {
    return countries[0].name
}

export const getISOCodeByName = (name) => {
    if (!name) {
        return ''
    }
    return countries.filter(e => e.name == name)[0].isoCode
}

export const getCodeByCountryName = (name) => {
    if (!name) {
        return ''
    }

    const index = countries.findIndex((c) => {
        return c.name === name;
    });
    return index !== -1 ? countries[index].isoCode : '';
}

export const getSortedCountryNames = () => {
    return countries.sort(compare).map(e => e.name)
}

export const getSortedCityNamesByCountryCode = (code) => {
    return cities.filter(e => e.countryCode == code).sort(compare).map(e => e.name)
}

export const defaultCityName = () => {
    return getSortedCityNamesByCountryCode(DEFAULT_COUNTRY_IS_CODE)[0]
}

export const getDefaultCityForCountry = (name) => {
    if (!name) {
        return ''
    }

    const isoCode = getCodeByCountryName(name)
    const cities = getSortedCityNamesByCountryCode(isoCode)[0]

    return cities
}