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
        <span>{this.state.a}</span>
        {this.children}
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
