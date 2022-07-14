/**
 *
 * HomePage
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../components/Button';
import auth from '../../utils/auth';

const HomePage = () => {
  return (
    <div style={{ marginTop: '15%' }}>
      <h1>You're now logged in!!!</h1>
      <div style={{ marginTop: '50px' }}>
        <Button
          primary
          onClick={() => {
            let navigate = useNavigate();
            auth.clearAppStorage();
            navigate('/auth/login');
          }}
        >
          Logout
        </Button>
      </div>
      <div>
        <Link to="/product">
          See all products
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
