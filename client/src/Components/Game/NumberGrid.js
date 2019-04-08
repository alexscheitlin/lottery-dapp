import React from 'react'

import GridNumber from "./GridNumber";

import {Label} from 'semantic-ui-react';



const getArrayFromTo = (from, to) => {
  if (isNaN(from) || from < 0 || isNaN(to) || to < 0) {
    return [];
  }

  return Array.from(new Array(to - from + 1), (val, index) => ((from - 1) + (index + 1)));
}

const numberGrid = (props) => {

  return (
    <Label.Group circular>
    {
      getArrayFromTo(props.minNumber, props.maxNumber).map((gridNumber, index) => {
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