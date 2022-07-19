/**
 *
 * ConnectPage
 *
 */

import React from 'react';
import { useEffect } from "react";
import { useLocation, useNavigate, useMatch } from 'react-router-dom';


// Utils
import auth from '../../utils/auth';
import request from '../../utils/request';

const ConnectPage = () => {
  // We only use this lifecycle because it's only mounted once and the saga already handle
  // the redirections depending on the API response

  // NOTE: YOU can delete this container and do the logic in the HomePage formContainer
  // This implementation was just made for the sake of the example and to simplify the logic

  const match = useMatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const requestURL = `${process.env.REACT_APP_STRAPI_HOST}/auth/${match.provider}/callback${location.search}`;

    request(requestURL, { method: 'GET' })
      .then(response => {
        auth.setToken(response.jwt, true);
        auth.setUserInfo(response.user, true);
        navigate('/');
      })
      .catch(err => {
        console.log(err.response.payload);
        navigate('/auth/login');
      })
  });


  return (
    <div>
      <h1>Retrieving your token and checking its validity</h1>
    </div>
  );
}

export default ConnectPage;
