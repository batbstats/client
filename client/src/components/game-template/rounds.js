import Commentary from './commentary';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {TableCell, TableRow} from '@material-ui/core';
import {getInitialLetters} from '../../utils';

function getRounds(attempts) {
  const rounds = [];
  for (let i = 0; i < attempts.length; i++) {
    let attempt = attempts[i];
    const round = {[attempt.skaterId]: attempt};
    if (attempt.successful) {
      i++;
      attempt = attempts[i];
      round[attempt.skaterId] = attempt;
    }

    rounds.push(round);
  }

  return rounds;
}

const LETTERS = 'SKATE'.split('');

export default function Rounds(props) {
  const rounds = getRounds(props.attempts);
  const letters = getInitialLetters(props.skaters);
  return (
    <Fragment>
      {rounds.map((round, index) => {
        let commentary;
        return (
          <Fragment key={index}>
            <TableRow>
              {props.skaters.map((skater, index, array) => {
                const attempt = round[skater.id];
                const opponent = array[index ? 0 : 1];
                if (!attempt) {
                  commentary = `${skater.firstName} misses, ${opponent.firstName}'s turn to set`;
                  return <TableCell key={skater.id} />;
                }

                const {offense, successful, trick, redos} = attempt;
                if (!offense && !successful) {
                  letters[skater.id]++;
                  const word = LETTERS.slice(0, letters[skater.id]);
                  commentary = `${skater.firstName} gets ${word.join('.')}.`;
                  if (word.length === 5) {
                    commentary += `; ${opponent.firstName} wins!`;
                  }
                }

                return (
                  <TableCell align={index ? 'left' : 'right'} key={skater.id}>
                    <span
                      style={{
                        textDecoration:
                          offense && !successful ? 'line-through' : 'none'
                      }}
                    >
                      {offense ? trick.name : successful ? '✅' : '❌'}
                      {redos > 0 && ' 🔄'}
                      {redos > 1 && `x${redos}`}
                    </span>
                  </TableCell>
                );
              })}
            </TableRow>
            {commentary && <Commentary>{commentary}</Commentary>}
          </Fragment>
        );
      })}
    </Fragment>
  );
}

Rounds.propTypes = {
  attempts: PropTypes.array.isRequired,
  skaters: PropTypes.array.isRequired
};
