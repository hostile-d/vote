import React from 'react';
import base from './../db';
import Input from './Input';

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      playerNames: ['','']
    };
  }
  componentDidMount() {
    this.ref = base.syncState('settings/room', {
      context: this,
      state: 'room'
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const room = this.state.playerNames.join('-');
    this.setState({
      room
    });
  }
  
  handleChange = (index,e) => {
    const playerNames = [...this.state.playerNames];
    playerNames[index] = e.target.value
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
              handleChange={this.handleChange.bind(this, index)}
            />
          ))}
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}