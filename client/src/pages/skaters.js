import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import orderBy from 'lodash/orderBy';
import sentenceCase from 'sentence-case';
import {connect} from 'react-redux';
import {getSkaters} from '../selectors';
import {load as loadGames} from '../actions/games';

const columns = [
  {
    key: 'full_name',
    label: 'Name'
  },
  {
    key: 'hometown'
  },
  {
    key: 'age',
    numeric: true
  },
  {
    key: 'gamesPlayed',
    numeric: true
  },
  {
    key: 'wins',
    numeric: true
  },
  {
    key: 'losses',
    numeric: true
  }
];

const ORDER_ASC = 'asc';
const ORDER_DESC = 'desc';

class Skaters extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    skaters: PropTypes.array.isRequired
  };

  state = {
    order: ORDER_DESC,
    orderBy: null
  };

  componentDidMount() {
    this.props.dispatch(loadGames());
  }

  sort = key =>
    this.setState(prevState => ({
      order:
        prevState.orderBy === key && prevState.order === ORDER_DESC
          ? ORDER_ASC
          : ORDER_DESC,
      orderBy: key
    }));

  render() {
    if (!this.props.skaters.length) {
      if (this.props.loading) {
        return <CircularProgress color="primary" />;
      }
      return <Typography>No skaters found</Typography>;
    }

    const skaters = orderBy(
      this.props.skaters,
      this.state.orderBy,
      this.state.order
    );

    return (
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.key} numeric={column.numeric}>
                <TableSortLabel
                  direction={this.state.order}
                  active={column.key === this.state.orderBy}
                  onClick={() => this.sort(column.key)}
                >
                  {column.label || sentenceCase(column.key)}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {skaters.map(skater => (
            <TableRow hover key={skater.id}>
              {columns.map(column => (
                <TableCell key={column.key} numeric={column.numeric}>
                  {skater[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.games.loading,
  skaters: getSkaters(state)
});

export default connect(mapStateToProps)(Skaters);
