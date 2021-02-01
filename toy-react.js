const RENDER_TO_DOM = Symbol('render to dom');

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.toLowerCase(), value);
    } else if (name === 'className') {
      this.root.setAttribute('class', value);
    } else {
      this.root.setAttribute(name, value);
    }
  }
  appendChild(component) {
    let range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    component[RENDER_TO_DOM](range);
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
    this._range = null;
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(component) {
    this.children.push(component);
  }

  [RENDER_TO_DOM](range) {
    this._range = range;
    this.render()[RENDER_TO_DOM](range);
  }
  rerender() {
    let oldRange = this._range;

    let range = document.createRange();
    range.setStart(oldRange.startContainer, oldRange.startOffset);
    range.setEnd(oldRange.startContainer, oldRange.startOffset);
    this[RENDER_TO_DOM](range);

    oldRange.setStart(range.startContainer, range.endOffset);
    oldRange.deleteContents();
  }

  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState;
      this.rerender();
      return;
    }

    let merge = (oldState, newState) => {
      if (newState) {
        for (let [key, value] of Object.entries(newState)) {
          if (Object.prototype.toString.call(value) !== '[object Object]') {
            oldState[key] = newState[key];
          } else {
            merge(oldState[key], newState[key]);
          }
        }
      }
    };

    merge(this.state, newState);
    this.rerender();
  }
}

/**
 * 通过 plugin-transform-react-jsx 将 React.creatElement 映射为 createElement，
 * 重写 creatElement，使其支持插入自定义组件
 */
export function createElement(type, attributes, ...children) {
  let el;
  if (typeof type === 'string') {
    el = new ElementWrapper(type);
  } else {
    el = new type(attributes);
  }

  if (attributes) {
    for (let [key, value] of Object.entries(attributes)) {
      el.setAttribute(key, value);
    }
  }

  let insertChildren = (children) => {
    for (let child of children) {
      if (child === null) continue;

      if (typeof child === 'string' || typeof child === 'number') {
        child = new TextWrapper(child);
      }

      if (Array.isArray(child)) {
        insertChildren(child);
      } else {
        el.appendChild(child);
      }
    }
  };
  insertChildren(children);

  return el;
}

export function render(component, parentElement) {
  let range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}
