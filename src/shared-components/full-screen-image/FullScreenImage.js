const FullScreenImage = ({ src, setImageView }) => (
  <div
    className="image-view-overlay flex center"
    onClick={() => setImageView(0)}
  >
    <div className="button-container">
      <div className="container">
        <div
          className="cancel new"
          onClick={() => {
            setImageView(0);
          }}
        >
          <span className="icon"></span>
        </div>
      </div>
    </div>
    <img src={src} alt="" />
  </div>
);

export default FullScreenImage;
