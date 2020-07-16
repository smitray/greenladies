import {QueryRenderer, graphql, Environment} from 'react-relay'
import React from 'react';

interface Props {
  environment: Environment;
}

export const App: React.FC<Props> = ({environment}) => {
  return <QueryRenderer
    environment={environment}
    query={
      graphql`
        query AppQuery {
          test {
            id
            name
          }
        }
      `}
      variables={{}}
      render={({error, props}) => {
        if (error) {
        return <div>{error.message}</div>
        }

        if (props) {
        return <div>YAY</div>
        }

        return <div>Loading...</div>
      }
    } />
}