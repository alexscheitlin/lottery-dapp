import React from 'react'
import {Container} from 'semantic-ui-react';

const wrapper = (props) => ( 
  <Container>
    {props.children}
  </Container>
)

export default wrapper;