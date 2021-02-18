import React, { Component } from "react";

class Counter extends Component {
  state = {
    count: 0,
    tags: ["tag1", "tag2", "tag3"],
    imageUrl: "https://picsum.photos/200"
  };
  styles = {
    fontSize: 10,
    forntWeight: "bold"
  };

  //   constructor() {
  //     super();
  //     this.handleIncrement = this.handleIncrement.bind(this);
  //   }

  renderTags() {
    if (this.state.tags.length == 0) return <p>There are no tags</p>;

    return (
      <ul>
        {this.state.tags.map(tag => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    );
  }

  handleIncrement = product => {
    this.setState({ count: this.state.count + 1 });
    console.log("increment clicked", this.state.count, product);
  };

  render() {
    return (
      <React.Fragment>
        <button
          onClick={() => {
            this.handleIncrement(1);
          }}
        >
          Increment
        </button>
        <div className={this.getBadgeClasses()}>{this.formatCount()}</div>
        {this.state.count == 0 ? <div>Please enter a new tag</div> : ""}
        {this.renderTags()}
      </React.Fragment>
    );
  }
  getBadgeClasses() {
    let classes = "badge m-2 ";
    classes += this.state.count == 0 ? "badge-warning" : "badge-primary";
    return classes;
  }

  formatCount() {
    const { count } = this.state;
    return count == 0 ? "Zero" : count;
  }
}

export default Counter;
