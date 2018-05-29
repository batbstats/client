import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import NotFound from '../not-found';
import theme from '../../theme';
import {load as loadSkater} from '../../actions/skater';
import Games from './games';
import Header from './header';
import Overview from './overview';

const Content = styled.div({
  flexGrow: 1,
  padding: theme.spacing.unit * 3,
  backgroundColor: theme.palette.grey[50]
});

const TabMenu = withProps({
  elevation: 0,
  color: 'inherit',
  position: 'sticky'
})(AppBar);

const defaultTab = 'overview';
class Skater extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    skater: PropTypes.object
  };

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.load();
    }
  }

  onTabChange = (event, value) => {
    let path = `/skaters/${this.props.match.params.id}`;
    if (value !== defaultTab) {
      path += `/${value}`;
    }
    this.props.history.push(path);
  };

  load = () => this.props.dispatch(loadSkater(this.props.match.params.id));

  render() {
    if (!this.props.skater) {
      if (this.props.loading) {
        return <CircularProgress />;
      }
      return <NotFound />;
    }

    return (
      <Fragment>
        <Header />
        <TabMenu>
          <Tabs
            centered
            value={this.props.match.params.tab || defaultTab}
            onChange={this.onTabChange}
          >
            <Tab label="Overview" value={defaultTab} />
            <Tab label="Games" value="games" />
            <Tab label="Roshambo" value="roshambo" />
          </Tabs>
          <Divider />
        </TabMenu>
        <Content>
          <Switch>
            <Route exact component={Overview} path="/skaters/:id" />
            <Route exact component={Games} path="/skaters/:id/games" />
          </Switch>
        </Content>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.skater.loading,
  skater: state.skater.properties
});

export default connect(mapStateToProps)(Skater);
