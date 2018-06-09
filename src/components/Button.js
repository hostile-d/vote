import React from 'react';

export default class Button extends React.Component {
  render() {
    return (
      <button
        className="client__button"
        type="button"
        onClick={this.props.handleVote}
        disabled={this.props.disabled}
      >
      {this.props.playerName}
      </button>
    );
  }
}
