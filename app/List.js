var React = require('react');

class List extends React.Component{
  render(){
    var listItems = this.props.items.map((item, index) => {
      return (
        <li key={index} className="list-group-item">
          <button
            className="glyphicon glyphicon-remove"
            onClick={this.props.remove.bind(null, index)}
          />
          <span>
            {item}
          </span>
        </li>
      )
    });
    return (
      <div className="col-sm-12">
        <ul className="list-group">
          {listItems}
        </ul>
      </div>
    )
  }
};

module.exports = List;