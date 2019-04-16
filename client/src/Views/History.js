import React from "react";

import Wrapper from "../Components/shared/Wrapper";

import {Grid} from 'semantic-ui-react';

const history = () => {
  return (
    <Wrapper>
      <Grid>
        <Grid.Row>
        <Grid.Column>
          History Component
        </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

export default history;
