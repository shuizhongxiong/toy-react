import { createElement, render, Component } from './toy-react';

class MyComponent extends Component {
  constructor() {
    super(); // 调用基类
    this.state = {
      a: 1,
      b: 2,
    };
  }

  render() {
    return (
      <div>
        <h1>my component</h1>
        <button
          onClick={() => {
            this.setState({
              a: this.state.a++,
            });
          }}
        >
          add
        </button>
        <span>{this.state.a}</span>
        <span>{this.state.b}</span>
      </div>
    );
  }
}

render(
  <MyComponent id='a' class='c'>
    <div>abc</div>
    <div></div>
    <div></div>
  </MyComponent>,
  document.body
);
