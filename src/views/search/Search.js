import React, { useRef, useContext, useState, useEffect } from "react";
import "./Seacrh.scss";
import { GlobalContext } from "../../contexts/Global";
import { VoucherSetBlock } from "../activity/Activity";
import { IconHome } from "../../shared-components/icons/Icons";
import { useLocation } from "react-router";
import { QUERY_PARAMS, ROUTE } from "../../helpers/configs/Dictionary";

function Search() {
  const searchInput = useRef();
  const globalContext = useContext(GlobalContext);
  const [voucherSets, setVoucherSets] = useState([]);

  const allVoucherSets = globalContext.state.allVoucherSets;
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);

  const filterVoucherSets = (arr, query) => {
    return arr.filter(function (voucherSet) {
      return voucherSet?.title?.toLowerCase().includes(query?.toLowerCase());
    });
  };

  const handleSearchCriteria = (e) => {
    if (!e) {
      setVoucherSets([]);
      return;
    }

    setVoucherSets(filterVoucherSets(allVoucherSets, e));
  };

  const clearSearch = () => {
    searchInput.current.value = "";
    setVoucherSets([]);
  };

  useEffect(() => {
    searchInput?.current?.focus();

    const searchCriteria = queryParam.get(QUERY_PARAMS.SEARCH_CRITERIA);

    if (searchCriteria && searchCriteria !== QUERY_PARAMS.EMPTY) {
      searchInput.current.value = searchCriteria;
      handleSearchCriteria(searchCriteria);
    }
  }, [allVoucherSets]);

  return (
    <>
      {allVoucherSets ? (
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
                      id="offer-title"
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
            <div className="vouchers-container">
              {voucherSets.length > 0
                ? voucherSets.map((voucherSet, id) => (
                    <VoucherSetBlock
                      {...voucherSet}
                      openDetails={true}
                      searchCriteria={
                        searchInput.current.value
                          ? searchInput.current.value
                          : "null"
                      }
                      key={id}
                    />
                  ))
                : searchInput?.current?.value === ""
                ? allVoucherSets.map((voucherSet, id) => (
                    <VoucherSetBlock
                      {...voucherSet}
                      openDetails={true}
                      searchCriteria={
                        searchInput.current.value
                          ? searchInput.current.value
                          : "null"
                      }
                      key={id}
                    />
                  ))
                : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default Search;
