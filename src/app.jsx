var React    = require('react');
var ReactDOM = require('react-dom');
var Fluxxor  = require('fluxxor');

// Action Name
var constants = {
  ADD_MEMO:    "ADD_MEMO",
  DELETE_MEMO: "DELETE_MEMO"
};

// Store
var MemoStore = Fluxxor.createStore({
  initialize: function() {
    this.memo_id = 0;
    this.memos = {};

    this.bindActions(
      constants.ADD_MEMO,    this.onAddMemo,
      constants.DELETE_MEMO, this.onDeleteMemo
    );
  },
  onAddMemo: function(payload) {
    var id = ++this.memo_id;
    var memo = {
      id: id,
      text: payload.text,
      complete: false
    };
    this.memos[id] = memo;
    this.emit('change');
  },
  onDeleteMemo: function(payload) {
    var id = payload.id;
    delete this.memos[id];
    this.emit('change');
  },
  getState: function() {
    return { memos: this.memos };
  }
});

// Action
var actions = {
  addMemo: function(text) {
    this.dispatch(constants.ADD_MEMO, {text: text});
  },
  deleteMemo: function(id) {
    this.dispatch(constants.DELETE_MEMO, {id: id});
  }
};

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

// React Component
var MemoApp = React.createClass({
  mixins: [ FluxMixin, StoreWatchMixin("MemoStore") ],

  getInitialState: function() {
    return { newMemoText: "" };
  },
  getStateFromFlux: function() {
    return this.getFlux().store('MemoStore').getState();
  },
  onTextChange: function (e) {
    this.setState({newMemoText: e.target.value});
  },
  onKeyDown: function (e) {
    // 13 == Enter Key Code
    if (e.keyCode === 13 && this.state.newMemoText.trim()) {
      this.getFlux().actions.addMemo(this.state.newMemoText);
      this.setState({ newMemoText: "" });
    }
  },
  render: function() {
    var memos = Object.keys(this.state.memos).map(function(id) {
      return <MemoItem key={id} memo={this.state.memos[id]} />;
    }.bind(this));

    return (
      <div>
        <h1>Flux MemoApp</h1>
        <input type="text"
               onKeyDown={this.onKeyDown}
               onChange={this.onTextChange}
               value={this.state.newMemoText} />
        <ul>{memos}</ul>
      </div>
    );
  }
});

var MemoItem = React.createClass({
  mixins: [FluxMixin],

  onDelete: function() {
    this.getFlux().actions.deleteMemo(this.props.memo.id);
  },
  render: function() {
    var memo = this.props.memo;
    return (
      <li>
        <button onClick={this.onDelete}>Delete</button>
        <span>{memo.text}</span>
      </li>
    );
  }
});

var stores = { MemoStore: new MemoStore() };
var flux = new Fluxxor.Flux(stores, actions);

// React Render
ReactDOM.render(
  <MemoApp flux={flux} />,
  document.getElementById('memo')
);
