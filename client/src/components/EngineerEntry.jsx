const EngineerEntry = ({engineer}) => (
  <div className="engineer-entry">
    <div className="screenshot">
      {/*return from cloudinary upload function}*/}
      <img src={engineer.image} />
    </div>

    <div className="information">
      <p>Name: {engineer.name}</p>
    </div>

  </div>
);

EngineerEntry.propTypes = {
  engineer: React.PropTypes.object.isRequired
};

window.EngineerEntry = EngineerEntry;
