/**
 *
 *
 * App
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

// Components
import AuthPage from '../../containers/AuthPage';
import ConnectPage from '../../containers/ConnectPage';
import EditPage from '../../containers/EditPage';
import HomePage from '../../containers/HomePage';
import NotFoundPage from '../../containers/NotFoundPage';
import ProductPage from '../../containers/ProductPage';
import { ToastContainer } from 'react-toastify';


// This component ios HoC that prevents the user from accessing a route if he's not logged in
import PrivateRoute from '../../containers/PrivateRoute';

// Design
import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          {/* A user can't go to the HomePage if is not authenticated */}
          <Route path="/auth/:authType" element={<AuthPage />} />
          <Route path="/auth/:authType/:id" element={<AuthPage />} />
          <Route exact path='/' element={<PrivateRoute />}>
            <Route exact path='/' element={<HomePage />} />
          </Route>

          <Route exact path="/products" element={<PrivateRoute />}>
            <Route exact path="/products" element={<ProductPage />} />
          </Route>

          <Route exact path="/products/:id" element={<PrivateRoute />}>
            <Route exact path="/products/:id" element={<EditPage />} />
          </Route>

          <Route exact path="/connect/:provider" element={<ConnectPage />} />
          <Route path="" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
