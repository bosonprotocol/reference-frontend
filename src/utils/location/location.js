import cities from "./city.json";
import countries from "./country.json";

export const DEFAULT_COUNTRY_ISO_CODE = "";
export const DEFAULT_COUNTRY_NAME = "";
export const DEFAULT_CITY_NAME = "";

const compare = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

export const getISOCodeByName = (name) => {
  if (!name) {
    return "";
  }
  return countries.filter((e) => e.name == name)[0].isoCode;
};

export const getCodeByCountryName = (name) => {
  if (!name) {
    return "";
  }

  const index = countries.findIndex((c) => {
    return c.name === name;
  });
  return index !== -1 ? countries[index].isoCode : "";
};

export const getSortedCountryNames = () => {
  return countries.sort(compare).map((e) => e.name);
};

export const getSortedCityNamesByCountryCode = (code) => {
  if (!code) {
    return "";
  }
  return cities
    .filter((e) => e.countryCode == code)
    .sort(compare)
    .map((e) => e.name);
};
export const getDefaultCityForCountry = (isoCode) => {
  if (!isoCode) {
    return "";
  }

  return getSortedCityNamesByCountryCode(isoCode)[0];
};

export const getAllCityNames = () => {
  return cities.map((e) => {
    return {
      name: e.name,
      country: e.country,
    };
  });
};
