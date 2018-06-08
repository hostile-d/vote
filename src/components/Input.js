import React from 'react';

export default class Button extends React.Component {
  render() {
    return (
      <div>
          <label htmlFor="player1-name">Player 1 name: </label>
          <input id={`player-${this.props.index}name`} type="text" onChange={this.props.handleChange} />
        </div>
    );
  }
}
