import Blockies from "react-blockies";

const Identicon = ({ address, size }) => {
  return <Blockies className="icon" seed={address} size={size} />;
};

export default Identicon;
