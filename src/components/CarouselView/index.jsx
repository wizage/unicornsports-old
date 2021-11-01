/* eslint-disable import/order */
import React, { Component } from 'react';
import './index.css';
import GridCardView from '../GridCardView';
import SlideButton from '../SlideButtons';
// <<Location9
import {
  API, graphqlOperation,
} from 'aws-amplify';
import * as queries from '../../graphql/queries';
// Location9>>

class CarouselView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosenItem: {},
      sources: [],
      items: [{
        id: 'test',
        title: 'word'
      },
      {
        id: 'test2',
        title: 'word'
      },
      {
        id: 'test3',
        title: 'word'
      }
    ],
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
    API.graphql(graphqlOperation(queries.listChannels, input)).then((results) => {
      this.setState({ items: results.data.listChannels.items, width });
    }).catch((e) => {
      console.log(`Error with returning, ${e} `);
    });
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

  displayMovie = async (itemId) => {
    //Handle Click
  }

  clearItem = () => {
    // Undo Click
  }

  drawTitle = () => {
    return (
      <h3 className="carouselTitle">
        Generic Shelf
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
      <button type="button" className="carouselCard" onClick={(e) => this.displayMovie(item.id, e)} aria-label={item.title} key={item.id}><GridCardView item={item} /></button>
    ));
    if (items.length < 2) {
      return (<div ref={this.viewRef} />);
    }
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
