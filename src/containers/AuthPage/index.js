/**
 *
 * AuthPage
 *
 */

import React from 'react';
import { useState } from "react";
import { findIndex, get, map, replace, set } from 'lodash';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


import Button from '../../components/Button';
import FormDivider from '../../components/FormDivider';
import Input from '../../components/InputsIndex';
import Logo from '../../assets/logo_strapi.png';
import SocialLink from '../../components/SocialLink';

// Utils
import auth from '../../utils/auth';
import request from '../../utils/request';

import formSettings from './formSettings.json';
import './styles.css';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();



  const [errors, setErrors] = useState([]);
  const [didCheckErrors, setDidCheckErrors] = useState(false);

  const getInitialFormValues = () => {

    const code = location.search
      ? replace(location.search, '?code=', '')
      : params.id;
    const values = get(formSettings, ['data', params.authType], {});

    if (params.authType === 'reset-password') {
      set(values, 'code', code);
    }

    return values;
  };


  const [formValues, setFormValues] = useState(() => {
    const initialFormValues = getInitialFormValues();
    return initialFormValues;
  });

  const divStyle =
    params.authType === 'register'
      ? { marginTop: '3.2rem' }
      : { marginTop: '.9rem' };
  const inputs = get(formSettings, ['views', params.authType], []);
  const providers = ['facebook', 'github', 'google', 'twitter']; // To remove a provider from the list just delete it from this array...

  const getRequestURL = () => {
    let requestURL;

    switch (params.authType) {
      case 'login':
        requestURL = 'http://localhost:1337/api/auth/local';
        break;
      case 'register':
        requestURL = 'http://localhost:1337/api/auth/local/register';
        break;
      case 'reset-password':
        requestURL = 'http://localhost:1337/api/auth/reset-password';
        break;
      case 'forgot-password':
        requestURL = 'http://localhost:1337/api/auth/forgot-password';
        break;
      default:
    }

    return requestURL;
  };

  const handleChange = ({ target }) =>
    setFormValues({ ...formValues, [target.name]: target.value });

  const handleSubmit = e => {
    e.preventDefault();
    auth.clearToken();
    const body = formValues;
    const requestURL = getRequestURL();

    // This line is required for the callback url to redirect your user to app
    if (params.authType === 'forgot-password') {
      set(body, 'url', 'http://localhost:3000/api/auth/reset-password');
    }

    request(requestURL, { method: 'POST', body: body })
      .then(response => {
        auth.setToken(response.jwt, body.rememberMe);
        auth.setUserInfo(response.user, body.rememberMe);
        navigate('/');
      })
      .catch(err => {
        // TODO handle errors for other views
        // This is just an example

        toast.error(`Error! ${err}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        if (! typeof err === 'undefined') {
          setErrors([
            { name: 'identifier', errors: [err.response.payload.error.message] },
          ]);
        }
        setDidCheckErrors(!didCheckErrors);
      });
  };


  /**
   * Check the URL's params to render the appropriate links
   * @return {Element} Returns navigation links
   */
  const renderLink = () => {
    if (params.authType === 'login') {
      return (
        <div>
          <Link to="/auth/forgot-password">Forgot Password</Link>
          &nbsp;or&nbsp;
          <Link to="/auth/register">Register</Link>
        </div>
      );
    }

    return (
      <div>
        <Link to="/auth/login">Ready to signin</Link>
      </div>
    );
  };

  return (
    <div className="authPage">
      <div className="wrapper">
        <div className="headerContainer">
          {params.authType === 'register' ? (
            <span>Welcome !</span>
          ) : (
            <img src={Logo} alt="logo" />
          )}
        </div>
        <div className="headerDescription">
          {params.authType === 'register' ? (
            <span>Please register to access the app.</span>
          ) : (
            ''
          )}
        </div>
        <div className="formContainer" style={divStyle}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                {providers.map(provider => (
                  <SocialLink provider={provider} key={provider} />
                ))}
              </div>
            </div>
            <FormDivider />
            <form onSubmit={handleSubmit}>
              <div className="row" style={{ textAlign: 'start' }}>
                {map(inputs, (input, key) => (
                  <Input
                    autoFocus={key === 0}
                    customBootstrapClass={get(input, 'customBootstrapClass')}
                    didCheckErrors={didCheckErrors}
                    errors={get(
                      errors,
                      [
                        findIndex(errors, ['name', input.name]),
                        'errors',
                      ],
                      []
                    )}
                    key={get(input, 'name')}
                    label={get(input, 'label')}
                    name={get(input, 'name')}
                    onChange={handleChange}
                    placeholder={get(input, 'placeholder')}
                    type={get(input, 'type')}
                    validations={{ required: true }}
                    value={get(formValues, get(input, 'name'), '')}
                  />
                ))}
                <div className="col-md-12 buttonContainer">
                  <Button
                    label="Submit"
                    style={{ width: '100%' }}
                    primary
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="linkContainer">{renderLink()}</div>
      </div>
    </div>
  );
}

AuthPage.defaultProps = {};
AuthPage.propTypes = {};

export default AuthPage;
