import Bracket from './bracket';
import Layout from '../layout';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {Typography} from '@material-ui/core';
import {getInitialLetters} from '../../utils';
import {graphql} from 'gatsby';

function getBye(replacements) {
  for (let i = 0; i < replacements.length; i++) {
    // the heuristic for determining a bye is if the game has a replacement
    // where the value of inId is NULL
    const replacement = replacements[i];
    if (replacement.inId === null) {
      return replacement.outId;
    }
  }

  return null;
}

export default function EventTemplate(props) {
  const {name, games} = props.data.batbstats.event;
  return (
    <Layout>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <Typography gutterBottom variant="h4">
        {name}
      </Typography>
      <Bracket
        games={games.map(game => {
          const initialLetters = getInitialLetters(game.skaters);
          const letters = game.attempts.reduce((acc, attempt) => {
            // increment letter count if attempt was in defense and unsuccessful
            if (!attempt.offense && !attempt.successful) {
              return {
                ...acc,
                [attempt.skaterId]: acc[attempt.skaterId] + 1
              };
            }

            return acc; // otherwise return existing counts
          }, initialLetters);

          return {
            ...game,
            letters,
            bye: getBye(game.replacements)
          };
        })}
      />
    </Layout>
  );
}

EventTemplate.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query EventQuery($id: ID!) {
    batbstats {
      event(id: $id) {
        id
        name
        games {
          id
          round
          skaters {
            id
            fullName
            country
            stance
          }
          replacements {
            inId
            outId
          }
          attempts {
            offense
            successful
            skaterId # TODO: use skater.id
            trick {
              id
              variation
              flip
              spin
            }
          }
        }
      }
    }
  }
`;
