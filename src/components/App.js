import React from 'react';
import Button from './Button';
import base from './../db';
import deepKeys from 'deep-keys';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voterId:'',
      loading: true,
      disabledButtons: true,
      roomName: '',
      roomKey: '',
      room: "",
      playerNames: {
        player0: '',
        player1: ''
      },
      playerScores: {
        player0: 0,
        player1: 0
      }
    };
  }
  componentDidMount() {
    this.setId();
    this.getSettings();
  }
  setId() {
    let voterId = localStorage.getItem('voterId');
    if(voterId) {
      this.setState({
        voterId
      })
    } else {
      const newId = Date.now();
      localStorage.setItem('voterId', newId)
      voterId = newId;

      this.setState({
        voterId
      })
    }
  }
  getSettings() { 
    base.syncState('settings/playerNames', {
      context: this,
      state: 'playerNames',
      then() {
        this.getRoomKey();
      }
    });
  }
  getRoomKey() {
    base.syncState('settings/roomKey', {
      context: this,
      state: 'roomKey',
      then() {
        this.getRoomName();
      }
    });
    
  }
  getRoomName() {
    const p1 = this.state.playerNames.player0;
    const p2 = this.state.playerNames.player1;
    const roomName = `${p1}-${p2}`;
    this.setState({
      roomName
    });
    this.getRoom();
  }
  getRoom(){
    const endpoint = `rooms/${this.state.roomKey}/${this.state.roomName}`;
    this.ref = base.syncState(endpoint, {
      context: this,
      state: 'room',
      then() {
        this.setState({ 
          loading: false
        });
        this.calcVotes();
      }
    });
  }
  calcVotes() {
    const state = this.state;
    const length = Object.keys(state.playerNames).length;
    for (let i = 0; i < length; i++) {
      const player = 'player' + i;
      const score = Object.keys(state.room[state.playerNames[player]]).length;
      const playerScores = {...this.state.playerScores};
      playerScores[player] = score;
      this.setState({
        playerScores
      });
    }
    this.toggleButtons();
  }
  toggleButtons() {
    const allKeys = deepKeys(this.state.room);
    const string = allKeys.join('');
    const regexp = new RegExp(`${this.state.voterId}`)
    if(string.match(regexp)) {
      this.setState({
        disabledButtons: true
      });
    } else {
      this.setState({
        disabledButtons: false
      });
    }
  }
  handleVote(key) {
    const room = {...this.state.room}
    const player = this.state.playerNames[key];
    const id = this.state.voterId;
    room[player][id] = true;
    this.setState({
      room: room,
      disabledButtons: true
    });
  }
  // componentWillUnmount() {
  //   base.removeBinding(this.ref);
  // }
  render() {
    return (
      <div>
        <h3> Vote for best Player </h3>
          {this.state.loading === true
            ? <h3> LOADING... </h3>
            : <div>
                {Object.keys(this.state.playerNames).map((key, index) => (
                  <div key={key}>{`${this.state.playerNames[key]}: ${this.state.playerScores[key]}`}</div>
                ))}
              </div>}
          {Object.keys(this.state.playerNames).map((key, index) => (
            <Button
              key={key}
              index={index}
              handleVote={this.handleVote.bind(this, key)}
              disabled={this.state.disabledButtons}
              playerName={this.state.playerNames[key]}
            />
          ))}
      </div>
    );
  }
}