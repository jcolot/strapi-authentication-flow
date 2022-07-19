/**
 *
 * HomePage
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../components/Button';
import auth from '../../utils/auth';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: '15%' }}>
      <h1>You're now logged in!!!</h1>
      <div style={{ marginTop: '50px' }}>
        <Button className="btn shadow m-auto mb-4"
          primary
          onClick={() => {
            auth.clearAppStorage();
            navigate('/auth/login');
          }}
        >
          Logout
        </Button>
      </div>
      <div>
        <Link to="/products">
          See all products
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
