/**
 *
 * SocialLink
 *
 */

import React from 'react';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';
import { ReactComponent as FacebookLogo }  from './facebook.svg';
import { ReactComponent as GoogleLogo } from './google.svg';
import { ReactComponent as GithubLogo } from './github.svg';
import { ReactComponent as TwitterLogo } from './twitter.svg';


import Button from '../../components/Button';

import './styles.css';

function SocialLink({ provider }) {

  let logo = <></>;

  if (provider === "google") {
    logo = <GoogleLogo />;
  } else if (provider === "github") {
    logo = <GithubLogo />;
  } else if (provider === "facebook") {
    logo = <FacebookLogo />;
  } else if (provider) {
    logo = <TwitterLogo />;
  }
  
  return (
    <a href={`${process.env.REACT_APP_STRAPI_HOST}/connect/${provider}`} className="link">
      <Button type="button" social={provider} style={{ width: '100%' }}>
        {logo}
        {capitalize(provider)}
      </Button>
    </a>
  );
}

SocialLink.propTypes = {
  provider: PropTypes.string.isRequired,
};

export default SocialLink;
