import React from 'react'

import { Statistic, Icon } from 'semantic-ui-react';

const drawing = (props) => {
  const currentBlock = { label: "current block", number: props.currentBlock, color:"" };
  const startBlock = { label: "start block", number: props.startBlock, color:"grey" };
  const endBlock = { label: "end block", number: props.endBlock, color:"grey" };
  const drawBlock = { label: "draw block", number: props.drawBlock, color:"grey" };

  const blocks = [startBlock];

  if (currentBlock.number < endBlock.number) {
    blocks.push(currentBlock);
    blocks.push(endBlock);
    blocks.push(drawBlock);
  } else {
    if (currentBlock.number < drawBlock.number) {
      blocks.push(endBlock);
      blocks.push(currentBlock);
      blocks.push(drawBlock);
    } else {
      blocks.push(endBlock);
      blocks.push(drawBlock);
      blocks.push(currentBlock);
    }
  }

  return (
    <Statistic.Group horizontal size='mini'>
      {
        blocks.map((block, index) => {
          return (
            <Statistic key={index}>
              <Statistic.Value><Icon name="cube" color={block.color} /> # {block.number || 0}</Statistic.Value>
              <Statistic.Label>{block.label}</Statistic.Label>
            </Statistic>
          )
        })
      }
    </Statistic.Group>
  )
}

export default drawing;