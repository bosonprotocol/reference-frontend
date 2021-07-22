import { useHistory } from "react-router";
import { ROUTE, FOOTER } from "../../helpers/configs/Dictionary";
import "./Footer.scss";

function Footer({ route }) {
  const history = useHistory();

  const FOOTER_DATA = {
    TextHome: FOOTER.DOCS,
    TextDocs: FOOTER.LEPTONITE_APP,
    Class: route === ROUTE.Home ? "footer-home" : "",
  };

  const onRedirect = (e) => {
    e.target.innerText === FOOTER_DATA.TextHome
      ? history.push(ROUTE.Docs)
      : history.push(ROUTE.Home);
  };

  return (
    <footer className={FOOTER_DATA.Class}>
      <div>
        <p className="reserved-rights">©2021 BApp.</p>
        {route === ROUTE.Home ? (
          <p onClick={onRedirect}>
            <span>{FOOTER_DATA.TextHome}</span>
          </p>
        ) : (
          <p onClick={onRedirect}>
            <span>{FOOTER_DATA.TextDocs}</span>
          </p>
        )}
      </div>
    </footer>
  );
}

export default Footer;
