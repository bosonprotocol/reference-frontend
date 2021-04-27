import React, { useRef, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./PickUpLocation.scss";
import { GlobalContext, Action } from "../../contexts/Global";
import { ROUTE } from "../../helpers/configs/Dictionary";

import { IconHome } from "../../shared-components/icons/Icons";
import {getAllCityNames} from '../../utils/location/location'

function PickUpLocation() {
  const history = useHistory();

  const searchInput = useRef();
  const globalContext = useContext(GlobalContext);

  const allCities = getAllCityNames();
  const [filteredCities, setFilteredCities] = useState([]);
  const [query, setQuery] = useState("")

  const allVoucherSets = globalContext.state.allVoucherSets;

  const filterCities = (arr, query) => {
    return arr.filter(function (city) {
      return city?.toLowerCase().startsWith(query?.toLowerCase());
    });
  };

  const handleSearchCriteria = (e) => {
    if (!e) {
      setFilteredCities([]);
      return;
    }

    setFilteredCities(filterCities(allCities, e));
  };

  const clearSearch = () => {
    searchInput.current.value = "";
    setFilteredCities([])
    globalContext.dispatch(Action.filterVoucherSetsByCity("", allVoucherSets));
  };

  useEffect(()=> {
    const timeOutId = setTimeout(() => handleSearchCriteria(query), 500);
    return () => clearTimeout(timeOutId);
  }, [query])

 
  const setSelectedCityAndGoHome = (city) => {
    const filteredVouchers = allVoucherSets.filter(voucherSet => voucherSet.location.city == city)

    globalContext.dispatch(Action.filterVoucherSetsByCity(city, filteredVouchers));
    history.push(ROUTE.Home);
  }

  // SEARCH BAR
  return (
    <>
      {allCities ? (
        <section className="activity atomic-scoped">
          <div className="container">
            <div className="search-bar">
              <div className="row">
                <div className="field">
                  <div className="input focus">
                    <div className={`search-icon`}>
                      <IconHome />
                    </div>
                    <input
                      ref={searchInput}
                      id="filter-location"
                      type="text"
                      onChange={(e) =>
                        setQuery(e.target ? e.target.value : null)
                      }
                    />
                    <div
                      className={`clear-field ${
                        searchInput.current &&
                        (searchInput.current.value !== "" ? "active" : "hidden")
                      }`}
                      onClick={() => clearSearch()}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="voucher-set-container">
              {filteredCities.length > 0
                ? filteredCities.map((city, id) => (
                    <li
                      key={id}
                      onClick={() => setSelectedCityAndGoHome(city)}
                    >
                      {city}
                    </li>
                  ))
                : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default PickUpLocation;
