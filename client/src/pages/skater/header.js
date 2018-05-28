import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled, {css} from 'react-emotion';
import upperFirst from 'lodash/upperFirst';
import withProps from 'recompose/withProps';
import {connect} from 'react-redux';
import {size} from 'polished';
import theme from '../../theme';
import {getAge} from '../../selectors/skater';

const Container = styled.div({
  padding: theme.spacing.unit * 3
});

const flexAlignCenter = css({
  display: 'flex',
  alignItems: 'center'
});

const Heading = styled.div(flexAlignCenter);

const StyledAvatar = styled(Avatar)(size(48), {
  marginRight: theme.spacing.unit
});

const Details = styled.div(flexAlignCenter, {
  marginTop: theme.spacing.unit,
  color: theme.palette.grey[400]
});

const Detail = withProps({
  color: 'inherit',
  noWrap: true
})(
  styled(Typography)({
    ':not(:last-child)::after': {
      content: "'·'",
      margin: `0 ${theme.spacing.unit}px`
    }
  })
);

class Header extends Component {
  static propTypes = {
    age: PropTypes.number,
    skater: PropTypes.object.isRequired
  };

  renderDetails() {
    const details = [
      this.props.skater.hometown,
      this.props.skater.stance && upperFirst(this.props.skater.stance),
      this.props.age && `${this.props.age} years old`
    ].filter(Boolean);

    if (details.length === 0) {
      return null;
    }

    return (
      <Details>
        {details.map((detail, index) => (
          <Detail key={index.toString()}>{detail}</Detail>
        ))}
      </Details>
    );
  }

  render() {
    return (
      <Container>
        <Heading>
          <StyledAvatar src={this.props.skater.avatar}>
            {this.props.skater.first_name.charAt(0).toUpperCase()}
          </StyledAvatar>
          <div>
            {this.props.skater.last_name && (
              <Typography variant="subheading">
                {this.props.skater.first_name}
              </Typography>
            )}
            <Typography variant="title">
              {this.props.skater.last_name || this.props.skater.first_name}
            </Typography>
          </div>
        </Heading>
        {this.renderDetails()}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  age: getAge(state),
  skater: state.skater.properties
});

export default connect(mapStateToProps)(Header);
