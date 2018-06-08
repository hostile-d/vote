import React from 'react';
import base from './../db';
import Input from './Input';

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      playerNames: {
        player0: '',
        player1: ''
      }
    };
  }
  componentDidMount() {
    this.ref = base.syncState('settings/room', {
      context: this,
      state: 'room'
    });
    this.ref = base.syncState('settings/playerNames', {
      context: this,
      state: 'playerNames'
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const p1 = this.state.playerNames.player0;
    const p2 = this.state.playerNames.player1;
    const room = `${p1}-${p2}`;
    this.setState({
      room
    });
  }
  handleChange = (key,e) => {
    const playerNames = {...this.state.playerNames};
    playerNames[key] = e.target.value
    this.setState({
      playerNames
    });
  }
  render() {
    return (
      <div>
        <h3>{`Current Room is ${this.state.room}, create new one?`}</h3>
        <form onSubmit={this.handleSubmit}>
          {Object.keys(this.state.playerNames).map((key, index) => (
            <Input
              key={key}
              index={index}
              handleChange={this.handleChange.bind(this, key)}
            />
          ))}
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}