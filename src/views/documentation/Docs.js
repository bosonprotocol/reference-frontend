import { useContext } from "react";
import { useEffect } from "react/cjs/react.development";
import { NavigationContext, NavigationAction, } from "../../contexts/Navigation";

function Docs() {
  const navigationContext = useContext(NavigationContext);

  useEffect(() => {
    navigationContext.dispatch(
      NavigationAction.displayBottomNavigation(false)
    );
  }, []);

  return (
    <section className="not-found">
      <div class="prose prose-brand-purple dark:prose-dark">
        <h1 id="introduction-to-leptonite">Introduction to Leptonite</h1>
        <p><em><strong>Description below provided by Frontend Operator, not Boson Protocol</strong></em></p>
        <p>The Leptonite application can be accessed <a href="https://www.leptonite.io">here</a>.
                    Leptonite is a reference release of a peer-to-peer digital marketplace app built
                    on top of Boson Protocol. The app enables users to connect their wallets and
                    list a set of items for sale as well as discover products that can be purchased
                    in a decentralised way using Boson Protocol.</p>
        <p>The application also demonstrates Boson’s novel game theoretic mechanism showing
        how the transaction lifecycle can be tracked and co-ordinated by both parties.
        It provides developers an example of a dCommerce application that can be built
        on Boson Protocol and how Boson’s core exchange mechanism is applied to
        coordinate and automate the exchange of monetary for non-monetary value with
                    minimised arbitration, cost and friction.</p>
        <p>Leptonite is a Rinkeby testnet application.</p>
        <h2 id="how-it-works">How it works</h2>
        <ul>
          <li>Commitment NFTs for physical items — sellers can create ERC1155 listings for physical items</li>
          <li>Minting NFT on commitment — Buyers can purchase items, which mints an ERC721 NFT on commitment and payment</li>
          <li>Automated escrow code — The lifecycle of these commitment NFTs can be tracked by both buyer and seller, with each being incentivised to follow through to redemption (at which point payment is transferred and deposits are returned).</li>
        </ul>
        <h2 id="core-features">Core Features</h2>
        <ul>
          <li>Users can connect wallet from metamask or with wallet connect</li>
          <li>Seller can list an item for sale</li>
          <li>Seller can view their listings and void any remaining quantities that haven’t been committed to</li>
          <li>Seller can track the lifecycle of their listings that are committed to by buyers</li>
          <li>Seller can cancel, or admit fault on, a commitment token if issues arise</li>
          <li>Buyer can discover NFTs for physical items, filtering by description or location based on the metadata attached</li>
          <li>Buyer can commit to purchase a listed item with payment and a deposit going into Boson Protocol’s escrow code</li>
          <li>Buyer can redeem their commitment token when they collect an item</li>
          <li>Buyer can request a refund if they choose not to collect the item anymore</li>
          <li>Buyer can let the commitment expire and have funds returned</li>
          <li>Buyer can complain about a commitment token if issues arise</li>
        </ul>
        <h2 id="architecture">Architecture</h2>
        <p>The p2p marketplace is implemented as a full-stack application with a React front-end and a Node.js backend, both leveraging the Boson Protocol smart contracts.</p>
        {/* <p><img src="/images/docs/leptonite-architecture.png" alt="Leptonite Architecture"></p> */}
        <h2 id="technical-features">Technical features</h2>
        <ul>
          <li>Authentication system using ethereum wallet via metamask or wallet connect</li>
        </ul>
        <h2 id="versioning">Versioning</h2>
        <p>Version 0.1.0 of the Leptonite application works with version 0.1.0 of the Boson Protocol smart contracts. See the <a href="#repositories">Repositories</a> section below.</p>
        <h2 id="development-setup">Development setup</h2>
        <p>In order to contribute to the Leptonite application or further develop your own
        forked copy of the Leptonite application, you will need to set up a local
        development environemnt. This section explains how to do that. These instructions assume a working knowledge of git and GitHub.</p>
        <h3 id="repositories">Repositories</h3>
        <p>By default, v0.1.0 of the reference application points to v0.1.0 of the Boson
                    Protocol smart contracts deployed to the Rinkeby testnet.</p>
        <p>To run the Leptonite application locally while pointing to the smart contracts on the testnet, you will first need to clone the following repositories:</p>
        <ul>
          <li><a href="https://github.com/bosonprotocol/reference-frontend/releases/tag/v0.1.0">reference-frontend</a></li>
          <li><a href="https://github.com/bosonprotocol/reference-backend/releases/tag/v0.1.0">reference-backend</a></li>
        </ul>
        <p>Each of the repositories has a README that describes how to run the code locally.</p>
        <p>If you want to run your own local version of the Boson Protocol smart contracts, you will also need to clone the contracts repository:</p>
        <ul>
          <li><a href="https://github.com/bosonprotocol/contracts/releases/tag/v0.1.0">contracts</a></li>
        </ul>
        <p>The contracts repository also has a README that describes how to run the code locally. You will need take a few extra steps to point your local reference-frontend and reference-backend to the local version of the Boson Protocol smart contracts:</p>
        <ol>
          <li>reference-frontend: Change the smart contract addresses in <code>src/hooks/configs.js</code> to match the local addresses displayed in the terminal
                      after following the instructions for running locally in the contracts repo
                      README</li>
          <li>
            <p>reference-backend:</p>
            <ol>
              <li>
                <p>Add the following keys to the <code>config/deployments/local-development.yaml</code> file</p>
                <ul>
                  <li>voucher_kernel_address: “”</li>
                  <li>token_contact_address: “”</li>
                  <li>boson_router_contact_address: “”</li>
                  <li>cashier_address: “”</li>
                </ul>
              </li>
              <li>
                <p>Change the key values to point to your local contract instance addresses</p>
              </li>
            </ol>
          </li>
        </ol>
        <h2 id="known-issues">Known issues</h2>
        <p>There are a couple of known issues which users may experience while using the app:</p>
        <h3 id="cant-create-new-transactions">Can’t create new transactions</h3>
        <p>If you repeatedly get an error saying <em>Please wait for your recent transaction
                      to be minted before sending another one, when committing or listing an item,</em> or
                    while performing any other action that requires minting a new transaction,
                    please go to <code>Wallet -&gt; Advanced</code> and click the <code>RESET TRANSACTION BLOCKER </code>
                    button. This will resolve the issue and you will be able to proceed with new
                    transactions.</p>
        <h3 id="closing-the-browser-tab-or-window-while-minting-a-new-transaction">Closing the browser tab or window while minting a new transaction</h3>
        <p>When the browser tab or window running Leptonite is closed while the MetaMask
        pop up is triggered to confirm the transaction, users may not receive their
        commitment NFT. To avoid this issue, please do not close the Leptonite
        application while confirming a MetaMask transaction.</p>
      </div>

      <footer class="p-4 flex-grow text-sm dark:text-control-gray-dark">
        <p class="text-center">© Leptonite 2021</p>
      </footer>

    </section>
  );
}

export default Docs;
