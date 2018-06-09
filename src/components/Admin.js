import React from 'react';
import base from './../db';
import Input from './Input';

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      roomKey: '',
      playerNames: {
        player0: '',
        player1: ''
      },
      playerScores: {
        player0: 0,
        player1: 0
      },
      room: {}
    };
  }
  componentDidMount() {
    this.ref = base.syncState('settings/roomName', {
      context: this,
      state: 'roomName'
    });
    this.ref = base.syncState('settings/roomKey', {
      context: this,
      state: 'roomKey'
    });
    this.ref = base.syncState('settings/playerNames', {
      context: this,
      state: 'playerNames'
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  calcVotes() {
    const state = this.state;
    const length = Object.keys(state.playerNames).length;
    const playerScores = {...this.state.playerScores};
    for (let i = 0; i < length; i++) {
      const player = 'player' + i;
      const votes = state.room[state.playerNames[player]];
      let score = Object.keys(votes).length;
      for(let key in votes) {
        if (key === 'initVote') score--;
      }
      playerScores[player] = score;
      this.setState({
        playerScores
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const p1 = this.state.playerNames.player0;
    const p2 = this.state.playerNames.player1;
    const roomName = `${p1}-${p2}`;
    this.setState({
      roomName
    });
    base.push('rooms', {
      data: {
        [roomName]: {
          [this.state.playerNames.player0]: {
            initVote: false
          },
          [this.state.playerNames.player1]: {
            initVote: false
          }
        }
      }
    }).then(newLocation => {
      this.setState({
        roomKey: newLocation.key
      })
    })
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
        <h3>{`Current Room is ${this.state.roomName}, create new one?`}</h3>
        <form onSubmit={this.handleSubmit.bind(this)}>
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