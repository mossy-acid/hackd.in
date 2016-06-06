const EngineerList = ({engineers}) => (
  <div className="actual-content1 row">
    { engineers.map( (engineer, index) =>
      <EngineerEntry key={index} engineer={engineer} />
    )}
  </div>
);

EngineerList.propTypes = {
  engineers: React.PropTypes.array.isRequired
};

window.EngineerList = EngineerList;
