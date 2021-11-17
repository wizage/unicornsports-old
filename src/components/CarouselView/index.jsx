/* eslint-disable import/order */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import GridCardView from '../GridCardView';
import SlideButton from '../SlideButtons';
import {
  API, graphqlOperation,
} from 'aws-amplify';

/* Location 9 */

class CarouselView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosenItem: {},
      sources: [],
      items: [],
      activeItemIndex: 0,
      slideDistance: -75,
      username: props.username,
    };
    this.viewRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = state;
    const { username } = props;
    newState.username = username;
    return newState;
  }

  componentDidMount() {
    const { width } = this.useSizeElement();
    const input = {};
    /* Location 10 */
  }

  useSizeElement = () => {
    const width = this.viewRef.current.clientWidth;
    return { width };
  }

  handlePrev = () => {
    const { activeItemIndex } = this.state;
    const newActive = activeItemIndex - 1;
    if (newActive >= 0) {
      this.setLocation(newActive);
    }
  }

  setLocation = (active) => {
    this.setState({
      activeItemIndex: active,
      slideDistance: (active * -176) - 75,
    });
  }

  handleNext = () => {
    const width = this.viewRef.current.clientWidth;
    const { activeItemIndex, items } = this.state;
    const currentCount = items.length;
    const totalInView = Math.floor(width / 176) - 1;
    const newActive = activeItemIndex + 1;
    if (newActive < currentCount - totalInView) {
      this.setLocation(newActive);
    }
  }

  drawTitle = () => {
    return (
      <h3 className="carouselTitle">
        Live right now!
      </h3>
    );
  }

  render() {
    const {
      items,
      width,
      slideDistance,
    } = this.state;
    const style = {
      transform: `translate3d(${slideDistance}px, 0, 0)`,
    };
    const itemHTML = items.map((item) => (
      <Link className="carouselCard" to={`/${item.id}`} aria-label={item.title} key={item.id}><GridCardView item={item} /></Link>
    ));
    if (items.length < 1) {
      return (<div ref={this.viewRef} />);
    }
    console.log(items);
    return (
      <div ref={this.viewRef}>
        <div className="carouselFrame">
          {this.drawTitle()}
          <SlideButton onClick={this.handlePrev} type="prev" width={width} />
          <SlideButton onClick={this.handleNext} type="next" width={width} />
          <div className="carouselContainer" style={style}>
            {itemHTML}
          </div>
        </div>

      </div>
    );
  }
}

export default CarouselView;