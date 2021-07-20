import "./Docs.scss";

function Docs() {
  return (
    <section className="container-docs">
      <div className="main">
        <h1 id="introduction-to-leptonite">Introduction to Leptonite</h1>
        <p><em>Description below provided by Frontend Operator, not Boson Protocol</em></p>
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
        <p className="rinkeby">Leptonite is a Rinkeby testnet application.</p>
      </div>
    </section>
  );
}

export default Docs;
