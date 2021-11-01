import React from 'react';
import { Placeholder } from 'rsuite';
import { Button } from 'rsuite';
import './index.css';

const { Paragraph } = Placeholder;
const GridCardView = (props) => {
  const { item: { imageURL, title } } = props;
  return (
    <div className="caroCard">
      <div className="container">
        <Paragraph style={{ marginTop: 30, marginLeft: 10, marginRight: 10, marginBottom: 10 }} rows={6} active />
        <Button appearance="primary"> View Stream</Button>
      </div>
    </div>
  );
};

export default GridCardView;
