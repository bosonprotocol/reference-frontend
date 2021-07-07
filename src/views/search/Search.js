import React, { useRef, useContext, useState, useEffect } from "react";
import "./Search.scss";
import { GlobalContext } from "../../contexts/Global";
import { IconHome } from "../../shared-components/icons/Icons";
import { useLocation } from "react-router";
import { QUERY_PARAMS } from "../../helpers/configs/Dictionary";
import { VoucherSetBlock } from "../activity/components/OfferedVoucherSets";
import { useWeb3React } from "@web3-react/core";

function Search() {
  const searchInput = useRef();
  const globalContext = useContext(GlobalContext);
  const [voucherSets, setVoucherSets] = useState([]);
  const { account } = useWeb3React();

  const allVoucherSets = globalContext.state.allVoucherSets
    ? !account
      ? globalContext.state.allVoucherSets
      : globalContext.state.allVoucherSets.filter(
          (x) => x.voucherOwner.toLowerCase() !== account.toLowerCase()
        )
    : [];
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

  const SearchBlock = (props) => {
    function voucherSetBlockBuilder(voucherSet, id) {
      return (
        <VoucherSetBlock
          {...voucherSet}
          openDetails={true}
          searchCriteria={
            searchInput.current.value ? searchInput.current.value : "null"
          }
          key={id}
        />
      );
    }

    if (voucherSets.length > 0) {
      return voucherSets.map((voucherSet, id) =>
        voucherSetBlockBuilder(voucherSet, id)
      );
    } else {
      if (searchInput?.current?.value === "") {
        return allVoucherSets.map((voucherSet, id) =>
          voucherSetBlockBuilder(voucherSet, id)
        );
      } else {
        return <div>No vouchers available.</div>;
      }
    }
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
                      id="search-bar"
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
              <SearchBlock></SearchBlock>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default Search;
