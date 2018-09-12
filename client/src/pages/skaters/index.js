import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterDialogContent from './skater-dialog-content';
import SortableTable from '../../components/sortable-table';
import Typography from '@material-ui/core/Typography';
import find from 'lodash/find';
import styled, {css} from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import {connect} from 'react-redux';
import {getSkaters} from '../../selectors';

const spacing = theme.spacing.unit * 3;
const CreateButton = styled(Button)({
  position: 'absolute',
  bottom: spacing,
  right: spacing
});

const overflowVisible = css({overflow: 'visible'});

const title = 'Skaters';
class Skaters extends Component {
  static propTypes = {
    skaters: PropTypes.array.isRequired,
    user: PropTypes.object
  };

  state = {
    dialogOpen: false,
    skater: null
  };

  componentDidUpdate(prevProps) {
    if (this.state.skater && this.props.skaters !== prevProps.skaters) {
      this.setState({
        skater: find(this.props.skaters, ['id', this.state.skater.id])
      });
    }
  }

  onTableRowClick = skater =>
    this.setState({
      skater,
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
          <Fragment>
            <Header>
              <Typography variant="display1">{title}</Typography>
            </Header>
            <SortableTable
              padding="dense"
              rows={this.props.skaters}
              onRowClick={this.onTableRowClick}
              columns={[
                {
                  key: 'full_name',
                  label: 'Name'
                },
                {
                  key: 'games.length',
                  label: 'GP',
                  numeric: true
                },
                {
                  key: 'wins',
                  label: 'W',
                  numeric: true
                },
                {
                  key: 'losses',
                  label: 'L',
                  numeric: true
                },
                {
                  key: 'win_percentage',
                  label: 'W%',
                  numeric: true
                },
                {
                  key: 'attempts.length',
                  label: 'TA',
                  numeric: true
                },
                {
                  key: 'makes',
                  label: 'MA',
                  numeric: true
                },
                {
                  key: 'misses',
                  label: 'MI',
                  numeric: true
                },
                {
                  key: 'redos',
                  label: 'R',
                  numeric: true
                }
              ]}
            />
            {this.props.user && (
              <CreateButton color="secondary" variant="fab">
                <AddIcon />
              </CreateButton>
            )}
            {this.state.skater && (
              <Dialog
                fullWidth
                classes={{paper: overflowVisible}}
                open={this.state.dialogOpen}
                onClose={this.closeDialog}
              >
                <SkaterDialogContent skater={this.state.skater} />
              </Dialog>
            )}
          </Fragment>
        </GamesLoader>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  skaters: getSkaters(state),
  user: state.user.data
});

export default connect(mapStateToProps)(Skaters);
