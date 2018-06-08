import React from 'react';
import base from './../db';
import { format } from 'upath';


export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: [],
      room: ""
    };
  }
  componentDidMount() {
    console.log(this.state.votes);
    this.ref = base.syncState('settings', {
      context: this,
      asArray: true,
      state: 'room'
    });
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  render() {
    return (
      <div>
        <h3>{`Current Room is ${this.state.room}, create new one?`}</h3>
        <input type="text"/>
      </div>
    );
  }
}