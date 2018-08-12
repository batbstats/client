import Dialog from '@material-ui/core/Dialog';
import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import TrickDialogContent from './trick-dialog-content';
import {connect} from 'react-redux';
import {createIsEqualWithKeys} from '../../util';
import {getTricks} from '../../selectors';

const title = 'Tricks';

const isEqualWithKeys = createIsEqualWithKeys(
  'first_name',
  'last_name',
  'stance',
  'hometown',
  'birth_date',
  'updated_at'
);

class Tricks extends Component {
  static propTypes = {
    tricks: PropTypes.array.isRequired
  };

  state = {
    dialogOpen: false,
    trick: null
  };

  componentDidUpdate(prevProps) {
    if (this.state.trick && this.props.tricks !== prevProps.tricks) {
      const trick = find(this.props.tricks, ['id', this.state.trick.id]);
      if (trick && !isEqualWithKeys(trick, this.state.trick)) {
        this.setState({trick});
      }
    }
  }

  onTrickClick = trick =>
    this.setState({
      trick,
      dialogOpen: true
    });

  closeDialog = () => this.setState({dialogOpen: false});

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <GamesLoader>
          <Header>{title}</Header>
          <List>
            {this.props.tricks.map(trick => (
              <ListItem
                key={trick.id}
                button
                onClick={() => this.onTrickClick(trick)}
              >
                <ListItemText primary={trick.name} secondary={trick.attempts} />
              </ListItem>
            ))}
          </List>
          {this.state.trick && (
            <Dialog
              fullWidth
              open={this.state.dialogOpen}
              onClose={this.closeDialog}
            >
              <TrickDialogContent trick={this.state.trick} />
            </Dialog>
          )}
        </GamesLoader>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tricks: getTricks(state)
});

export default connect(mapStateToProps)(Tricks);
