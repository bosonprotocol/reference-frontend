import React, { useRef, useContext, useState } from "react";
import "./Seacrh.scss";
import { GlobalContext } from "../../contexts/Global";
import { VoucherSetBlock } from "../activity/Activity";
import { IconHome } from "../../shared-components/icons/Icons";

function Search() {
  const searchInput = useRef();
  const globalContext = useContext(GlobalContext);
  const [voucherSets, setVoucherSets] = useState([]);

  const allVoucherSets = globalContext.state.allVoucherSets;

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
                      key={id}
                    />
                  ))
                : searchInput?.current?.value === ""
                ? allVoucherSets.map((voucherSet, id) => (
                    <VoucherSetBlock
                      {...voucherSet}
                      openDetails={true}
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
