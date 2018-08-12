import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {ResponsiveLine} from '@nivo/line';
import {ResponsivePie} from '@nivo/pie';
import {connect} from 'react-redux';
import {setIncludeMisses} from '../../actions/settings';
import {size} from 'polished';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  height: 0,
  svg: {
    display: 'block'
  }
});

const symbolSize = 12;
const tickSize = 5;
const leftAxisOffset = -40;
const bottomAxisOffset = 36;
const margin = theme.spacing.unit * 4;
const Line = withProps({
  margin: {
    top: margin,
    right: margin,
    left: margin - leftAxisOffset + tickSize * 2,
    bottom: margin * 2 + bottomAxisOffset + symbolSize
  },
  axisBottom: {
    tickSize,
    tickPadding: tickSize,
    legend: 'event',
    legendOffset: 36,
    legendPosition: 'center'
  },
  axisLeft: {
    tickSize,
    tickPadding: tickSize,
    legend: 'count',
    legendOffset: -40,
    legendPosition: 'center'
  },
  legends: [
    {
      anchor: 'bottom',
      direction: 'row',
      translateY: margin + bottomAxisOffset + symbolSize,
      itemWidth: 100,
      itemHeight: symbolSize,
      symbolSize,
      symbolShape: 'circle'
    }
  ]
})(ResponsiveLine);

const Pie = withProps({
  margin: {
    top: margin,
    right: margin,
    left: margin,
    bottom: margin
  },
  innerRadius: 0.5,
  padAngle: 0.7,
  enableRadialLabels: false
})(ResponsivePie);

const Primary = styled.div({
  flexGrow: 1,
  height: 0,
  minHeight: 350
});

const Secondary = styled.div({
  display: 'flex',
  flexShrink: 0,
  backgroundColor: theme.palette.background.default
});

const PieContainer = styled.div(size(250));
const TextContainer = styled.div({paddingTop: margin});

class TrickCharts extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    includeMisses: PropTypes.bool.isRequired,
    lineData: PropTypes.array.isRequired,
    pieData: PropTypes.array.isRequired
  };

  onIncludeMissesChange = event =>
    this.props.dispatch(setIncludeMisses(event.target.checked));

  render() {
    return (
      <Container>
        <Primary>
          <Line data={this.props.lineData} />
        </Primary>
        <Secondary>
          <PieContainer>
            <Pie data={this.props.pieData} />
          </PieContainer>
          <TextContainer>
            <Typography gutterBottom variant="title">
              Examining patterns in tricks
            </Typography>
            <Typography>Some more interesting text here</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.includeMisses}
                  onChange={this.onIncludeMissesChange}
                />
              }
              label="Include misses"
            />
          </TextContainer>
        </Secondary>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  includeMisses: state.settings.includeMisses
});

export default connect(mapStateToProps)(TrickCharts);