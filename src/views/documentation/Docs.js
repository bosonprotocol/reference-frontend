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
      <div className="container">
        <p>Some Text</p>
      </div>
    </section>
  );
}

export default Docs;
