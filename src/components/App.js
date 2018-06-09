import React from 'react';
import Button from './Button';
import base from './../db';
import deepKeys from 'deep-keys';
import logo from './../images/delete-logo.svg';

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
        this.toggleButtons();
        this.pingDb();
      }
    });
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
    this.calcVotes();
  }

  pingDb() {
    setInterval(() => {
      base.fetch('settings/roomKey', {
        context: this,
        then(data){
          if(this.state.roomKey !== data) {
            window.location = '/'
            this.setState({
              disabledButtons: false
            });
          };
        }
      })
    }, 2000)
  }
  // componentWillUnmount() {
  //   base.removeBinding(this.ref);
  // }
  render() {
    return (
      <div className="client">
        <img className="logo" src={logo} />
        <h3 className="client__subtitle">Code in the dark challenge</h3>
        <h3 className="client__title">Vote for somebody:</h3>
          {this.state.loading === true
            ? <h3 className="client__loading"> LOADING... </h3>
            : <div className="client__results">
                {Object.keys(this.state.playerNames).map((key, index) => (
                  <div className="client__results-item" key={key}>{`${this.state.playerNames[key]}: ${this.state.playerScores[key]}`}</div>
                ))}
              </div>}
              <div className="client__buttons-wrapper">
                {Object.keys(this.state.playerNames).map((key, index) => (
                  <Button
                    className="client__button"
                    key={key}
                    index={index}
                    handleVote={this.handleVote.bind(this, key)}
                    disabled={this.state.disabledButtons}
                    playerName={this.state.playerNames[key]}
                  />
                ))}
              </div>
      </div>
    );
  }
}