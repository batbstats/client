import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reject from 'lodash/reject';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import values from 'lodash/values';
import {Link} from 'react-router-dom';

const StyledDialogContent = styled(DialogContent)({
  overflowY: 'visible'
});

const Games = styled.div({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

const Game = styled(Paper)({
  flexShrink: 0,
  width: 200,
  margin: `${theme.spacing.unit * 2}px 0`,
  textDecoration: 'none'
});

const Skater = styled(Typography)({
  padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`
});

const Connector = styled.div({
  display: 'flex',
  alignSelf: 'stretch',
  alignItems: 'center'
});

const bracketWidth = theme.spacing.unit * 2;
const bracketColor = theme.palette.grey[300];
const Bracket = styled.div({
  flexGrow: 1,
  width: bracketWidth,
  height: '50%',
  border: `solid 1px ${bracketColor}`,
  borderLeft: 'none'
});

const Line = styled.div({
  width: bracketWidth,
  height: 1,
  backgroundColor: bracketColor
});

function addGameChildren(game, rounds, index) {
  const children = rounds[index];
  if (!children) {
    return game;
  }

  return {
    ...game,
    children: children
      .filter(child => {
        const skaters = map(child.skaters, 'id');
        return game.skaters.some(skater => skaters.includes(skater.id));
      })
      .map(child => addGameChildren(child, rounds, index + 1))
  };
}

class EventContent extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired
  };

  renderBracket = game => (
    <Games key={game.id}>
      <Game component={Link} to={`/games/${game.id}`}>
        {game.skaters.map((skater, index) => (
          <Fragment key={skater.id}>
            <Skater
              noWrap
              title={skater.full_name}
              color={
                game.letters[skater.id] === 5 ? 'textSecondary' : 'default'
              }
            >
              {skater.full_name}
            </Skater>
            {!index && <Divider />}
          </Fragment>
        ))}
      </Game>
      {game.round > 1 && (
        <Connector>
          <Bracket />
          <Line />
        </Connector>
      )}
      <div>{game.children && game.children.map(this.renderBracket)}</div>
    </Games>
  );

  render() {
    const rounds = values(
      groupBy(reject(this.props.event.games, ['round', 5]), 'round')
    ).reverse();
    const game = addGameChildren(rounds[0][0], rounds, 1);
    return (
      <Fragment>
        <Helmet>
          <title>{this.props.event.name}</title>
        </Helmet>
        <Header>
          <Typography variant="headline">{this.props.event.name}</Typography>
        </Header>
        <StyledDialogContent>{this.renderBracket(game)}</StyledDialogContent>
      </Fragment>
    );
  }
}

export default EventContent;
