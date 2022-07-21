/**
 *
 * EditPage
 *
 */

import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findIndex, get, set, map, isEmpty, forOwn } from 'lodash';
// Components
import Button from '../../components/Button';
import Input from '../../components/InputsIndex';

// Utils
import request from '../../utils/request';

// Layout
import layout from './layout.json';

import './styles.scss';

const FILE_RELATIONS = {
  product: [{ name: 'pictures', multiple: true }],
};

const EditPage = () => {

  const params = useParams();
  const navigate = useNavigate();
  const [didCheckErrors, setDidCheckErrors] = useState(false);
  const [errors, setErrors] = useState([]);
  const [initialData, setInitialData] = useState({});
  const [modifiedData, setModifiedData] = useState({});

  const title = params.id === 'create' ? `Create a new product` : `Edit ${params.id}`;
  const display = layout["product"];

  const getProduct = async () => {
    if (params.id !== 'create') {
      const requestURL = `${process.env.REACT_APP_STRAPI_HOST}/api/products/${params.id}?populate=*`;
      const data = await request(requestURL, { method: 'GET' });
      const formattedData = {};
      forOwn(get(data, ['data', 'attributes'], {}), (value, key) => {
        if (key === 'pictures') {
          const pictures = get(value, ['data'], []);
          formattedData[key] = [];
          pictures.forEach(element => {
            const pictureAttributes = get(element, 'attributes', false);
            if (pictureAttributes) formattedData[key].push(pictureAttributes);
          });
        } else {
          formattedData[key] = value;
        }
      });
      setInitialData(formattedData);
      setModifiedData(formattedData);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);


  // Reset form to its inital value
  const cancel = () => setModifiedData(initialData);

  const handleChange = (e) => {
    const name = e.target.name;
    setModifiedData({ ...modifiedData, [name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO handle errors
    const body = Object.keys(modifiedData).reduce((acc, current) => {
      if (findIndex(FILE_RELATIONS['product'], ['name', current]) === -1) {
        acc[current] = modifiedData[current];
      } else {
        const alreadyUploadedFiles = modifiedData[current].filter(file => {
          if (file instanceof File === false) {
            return file;
          }
        });
        acc[current] = alreadyUploadedFiles;
      }
      return acc;
    }, {});
    const method = params.id === 'create' ? 'POST' : 'PUT';
    const requestURL = params.id === 'create' ? `${process.env.REACT_APP_STRAPI_HOST}/api/products` : `${process.env.REACT_APP_STRAPI_HOST}/api/products/${params.id}`;
    return request(requestURL, { method, body: {data: body} })
      .then(resp => {
        // Send the upload request for each added file
        if (!isEmpty(FILE_RELATIONS['product'])) {
          map(FILE_RELATIONS['product'], (value, key) => {
            if (!isEmpty(modifiedData[value.name])) {
              const body = new FormData();
              const refId = method === 'POST' ? get(resp, ['data', 'id'], '') : params.id;
              body.append('refId', refId);
              body.append('ref', 'api::product.product');
              body.append('field', value.name);


              map(modifiedData[value.name], file => {
                if (file instanceof File) {
                  body.append('files', file);
                }
              });

              return request(`${process.env.REACT_APP_STRAPI_HOST}/api/upload`, { method: 'POST', body, headers: {} }, false)
                .catch(err => {
                  console.log('error upload', err.response);
                });
            }
          });
        }

      })
      .catch(err => {
        console.log('err', err.response);
        //  TODO: Handle errors
      }).finally(() => {
        // TODO: make sure the redirection happens when all the files have been updated
        navigate('/products');
      });
  }

  return (
    <div className="editPageWrapper">
      <div className="container-fluid">
        <h1>{title}</h1>
        <form className="formWrapper" onSubmit={handleSubmit}>
          <div className="row">
            {display.map((input) => (
              <Input
                didCheckErrors={didCheckErrors}
                errors={get(
                  errors,
                  [
                    findIndex(errors, ['name', input.name]),
                    'errors',
                  ],
                  []
                )}
                key={input.name}
                label={input.name}
                name={input.name}
                onChange={handleChange}
                type={input.type}
                value={get(modifiedData, input.name, input.type === 'file' ? [] : '')}
                multiple
              />
            ))}
          </div>
          <div className="row">
            <div className="col-md-12">
              <Button type="button" onClick={cancel}>Cancel</Button>
              <Button type="submit" primary>Submit</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

EditPage.defaultProps = {};
EditPage.propTypes = {};

export default EditPage;
