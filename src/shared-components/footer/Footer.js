import { useHistory } from "react-router";
import { ROUTE, FOOTER } from "../../helpers/configs/Dictionary";
import "./Footer.scss";

function Footer({ route }) {
  const history = useHistory();

  const FOOTER_DATA = {
    Ref:
      route === ROUTE.Home
        ? ROUTE.Docs
        : "https://docs.bosonprotocol.io/applications/leptonite/",
    ATagText: FOOTER.DOCS_PORTAL,
    Class: route === ROUTE.Home ? "footer-home" : "",
    Target: "_blank",
    Twitter:
      "https://twitter.com/BosonProtocol?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor",
    Github: "https://github.com/bosonprotocol",
    Medium: "https://medium.com/@bosonprotocol",
  };

  const onRedirect = () => {
    history.push(FOOTER_DATA.Ref);
  };

  return (
    <footer className={FOOTER_DATA.Class}>
      <p className="reserved-rights">©2021 BApp.</p>
      {route === ROUTE.Home ? (
        <div className="links-container">
          <div className="links-container first">
            <p onClick={onRedirect}>
              <span>{FOOTER_DATA.ATagText}</span>
            </p>
            <p>
              <a
                className="ref"
                href={FOOTER_DATA.Twitter}
                target={FOOTER_DATA.Target}
              >
                Twitter
              </a>
            </p>
          </div>
          <div className="links-container second">
            <p>
              <a
                className="ref"
                href={FOOTER_DATA.Github}
                target={FOOTER_DATA.Target}
              >
                Github
              </a>
            </p>
            <p>
              <a
                className="ref"
                href={FOOTER_DATA.Medium}
                target={FOOTER_DATA.Target}
              >
                Medium
              </a>
            </p>
          </div>
        </div>
      ) : route === ROUTE.Home ? (
        <p onClick={onRedirect}>
          <span>{FOOTER_DATA.ATagText}</span>
        </p>
      ) : (
        <p>
          <a className="ref" href={FOOTER_DATA.Ref} target={FOOTER_DATA.Target}>
            {FOOTER_DATA.ATagText}
          </a>
        </p>
      )}
    </footer>
  );
}

export default Footer;
