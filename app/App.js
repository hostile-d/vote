var React = require('react');
var ReactDOM = require('react-dom');
var Rebase = require('re-base');
var List = require('./List');
var AddItem = require('./AddItem');
var Button = require('./Button');
var base = require('./rebase');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: [],
      loading: true
    };
  }
  componentDidMount() {
    console.log(this.state.votes);
    this.ref = base.syncState('game1/votes', {
      context: this,
      asArray: true,
      state: 'votes',
      then() {
        this.setState({ 
          loading: false,
          disabledButtons: false,
          votes: [0,0]
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

ReactDOM.render(<App />, document.getElementById('app'));
