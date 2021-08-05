import Blockies from "react-blockies";

const Identicon = ({ address }) => {
  return <Blockies className="icon" seed={address} size={10} />;
};

export default Identicon;
