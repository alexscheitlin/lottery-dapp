import React from 'react'

import GridNumber from "./GridNumber";

import {Label} from 'semantic-ui-react';

const numberGrid = (props) => {

  return (
    <Label.Group circular>
    {
      props.numbers.map((gridNumber, index) => {
        return (
          <GridNumber 
          key={index}
          value={gridNumber}
          activeNumber={props.activeNumber}
          onClick={props.onClick}/>
        )
      })
    }
  </Label.Group>
  )
}

export default numberGrid;