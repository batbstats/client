import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Helmet from 'react-helmet';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';

const About = () => (
  <Fragment>
    <Helmet>
      <title>About</title>
    </Helmet>
    <DialogTitle disableTypography>
      <Typography variant="display1">About the project</Typography>
    </DialogTitle>
    <DialogContent>
      <Typography paragraph>
        BATB Stats is a collection of charts and data visualizations about{' '}
        <a
          href="https://en.wikipedia.org/wiki/Game_of_Skate"
          target="_blank"
          rel="noopener noreferrer"
        >
          games of S.K.A.T.E.
        </a>{' '}
        played in the contest series, <em>Battle at the Berrics</em>.
      </Typography>
    </DialogContent>
  </Fragment>
);

export default About;
