import { useHistory } from "react-router";
import { ROUTE, FOOTER } from "../../helpers/configs/Dictionary";
import "./Footer.scss";

function Footer({ route }) {
  const history = useHistory();

  const FOOTER_DATA = {
    ref:
      route === ROUTE.Home
        ? ROUTE.Docs
        : "https://docs.bosonprotocol.io/applications/leptonite/",
    aTagText: FOOTER.DOCS_PORTAL,
    class: route === ROUTE.Home ? "footer-home" : "",
    target: "_blank",
  };

  const onRedirect = () => {
    history.push(FOOTER_DATA.ref);
  };

  return (
    <footer className={FOOTER_DATA.class}>
      {route === ROUTE.Home && <p className="reserved-rights">©2021 BApp.</p>}
      {route === ROUTE.Home ? (
        <p onClick={onRedirect}>
          <span> {FOOTER_DATA.aTagText}</span>
        </p>
      ) : (
        <p>
          <a className="ref" href={FOOTER_DATA.ref} target={FOOTER_DATA.target}>
            {FOOTER_DATA.aTagText}
          </a>
        </p>
      )}
    </footer>
  );
}

export default Footer;
