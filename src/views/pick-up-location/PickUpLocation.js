import React, { useRef, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./PickUpLocation.scss";
import { GlobalContext, Action } from "../../contexts/Global";
import { IconHome } from "../../shared-components/icons/Icons";
import { useLocation } from "react-router";
import { QUERY_PARAMS, ROUTE } from "../../helpers/configs/Dictionary";
import {getAllCityNames} from '../../utils/location/location'

function PickUpLocation() {
  const history = useHistory();

  const searchInput = useRef();
  const globalContext = useContext(GlobalContext);

  const allCities = getAllCityNames();
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);

  const [cities, setCities] = useState([]);

  const filterCities = (arr, query) => {
    return arr.filter(function (city) {
      return city?.toLowerCase().startsWith(query?.toLowerCase());
    });
  };

  const handleSearchCriteria = (e) => {
    if (!e) {
      setCities([]);
      return;
    }

    setCities(filterCities(allCities, e));
  };

  const clearSearch = () => {
    searchInput.current.value = "";
    setCities([]);
    globalContext.dispatch(Action.updateCityFilter(""));
  };

  useEffect(() => {
    searchInput?.current?.focus();
    const searchCriteria = queryParam.get(QUERY_PARAMS.SEARCH_CRITERIA);

    if (searchCriteria && searchCriteria !== QUERY_PARAMS.EMPTY) {
      searchInput.current.value = searchCriteria;
      handleSearchCriteria(searchCriteria);
    }
  }, [allCities]);

  const setSelectedCityAndGoHome = (city) => {

    globalContext.dispatch(Action.updateCityFilter(city));
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
                        handleSearchCriteria(e.target ? e.target.value : null)
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
              {cities.length > 0
                ? cities.map((city, id) => (
                    <li
                      key={city}
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
