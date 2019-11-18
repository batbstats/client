import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Box} from '@material-ui/core';
import {Helmet} from 'react-helmet';
import {Link, graphql, useStaticQuery} from 'gatsby';
import {ReactComponent as Logo} from 'twemoji/2/svg/1f6f9.svg';
import {LogoTitleProps} from '@trevorblades/mui-theme';

export default function Layout(props) {
  const data = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  const {title} = data.site.siteMetadata;
  return (
    <Fragment>
      <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`} />
      <Box
        height={64}
        px={3}
        display="flex"
        alignItems="center"
        bgcolor="white"
        position="sticky"
        top={0}
        zIndex="appBar"
      >
        <Box
          {...LogoTitleProps.root}
          component={Link}
          to="/"
          color="inherit"
          style={{textDecoration: 'none'}}
        >
          <Box {...LogoTitleProps.logo} component={Logo} />
          <Box {...LogoTitleProps.title}>{title}</Box>
        </Box>
      </Box>
      <Box p={3}>{props.children}</Box>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
