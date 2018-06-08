import React from 'react';
import Button from './Button';
import base from './../db';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: [],
      loading: true,
      disabledButtons: false,
      room: ""
    };
  }
  componentDidMount() {
    this.getVotes();
    // this.getRoom().then(console.log('resolved'));
  }

  async getRoom() { 
    await base.bindToState('settings', {
      context: this,
      state: 'room',
      then() {
        this.getVotes();
      }
    });
  }

  getVotes(){
    this.ref = base.syncState(`danil-sergey/votes`, {
      context: this,
      asArray: true,
      state: 'votes',
      then() {
        this.setState({ 
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  handleVote(index) {
    const votes = [...this.state.votes];
    votes[index]++;
    this.setState({
      votes: votes,
      disabledButtons: true
    });
  }
  render() {
    return (
      <div>
        <h3> Vote for best Player </h3>
          {this.state.loading === true
            ? <h3> LOADING... </h3>
            : <div>
                <div>{this.state.votes[0]}</div>
                <div>{this.state.votes[1]}</div>
              </div>}
          {Object.keys(this.state.votes).map((key, index) => (
                <Button
                    key={key}
                    index={index}
                    handleVote={this.handleVote.bind(this, index)}
                    disabled={this.state.disabledButtons}
                />
            ))}
      </div>
    );
  }
}