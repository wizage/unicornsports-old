import React, { Component } from 'react';
import IconArrowDown from './Icons/IconArrowDown';
import './index.css';

class SlideButton extends Component {
  navigate = (e) => {
    e.stopPropagation();
    const { onClick } = this.props;
    onClick();
  }

  render() {
    const { type } = this.props;
    return (
      <button className={`slide-button slide-button--${type}`} onClick={this.navigate} type="button">
        <span>
          <IconArrowDown />
        </span>
      </button>
    );
  }
}

export default SlideButton;
