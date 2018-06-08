import React from 'react';

export default class Button extends React.Component {
  render() {
    return (
      <button
        type="button"
        onClick={this.props.handleVote}
        disabled={this.props.disabled}
      >
      {'Player ' + this.props.index}
      </button>
    );
  }
}
