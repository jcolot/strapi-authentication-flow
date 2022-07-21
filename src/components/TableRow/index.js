/**
 *
 * TableRow
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { get, isArray, isEmpty, startsWith } from 'lodash';

// import IcoContainer from 'components/IcoContainer';

import './styles.scss';


const TableRow = (props) => {
  return (
    <tr
      className="tableRow"
      onClick={(e) => {
        // Handle navigation to EditPage container
        e.preventDefault();
        props.onClick(props.data.id);
      }}
    >
      {props.headers.map(header => {

        if (header === 'pictures' && 'attributes' in props.data && !isEmpty(props.data.attributes[header])) {
          // Get the first pictures for display

          const picture = isArray(props.data.attributes[header].data) ?
            get(props.data.attributes, [header, 'data', '0', 'attributes', 'url'], '') :
            get(props.data.attributes, [header, 'data', 'attributes', 'url'], '');
          // check if we need to add the strapiBackendURL if the upload provider is local
          const src = startsWith(picture, '/') ? `${process.env.REACT_APP_STRAPI_HOST}${picture}` : picture;

          return (
            <td key={header}>
              <img src={src} alt={props.data.attributes[header].name} />
            </td>
          );
        }

        // Prepare for actions
        if (header === '') {
          return (
            <td key={header}>
              nothing
            </td>
          );
        }

        if (header === 'id') {
          return (
            <td key={header}>
              {props.data.id}
            </td>
          );
        }

        return (
          <td key={header}>
            {props.data.attributes[header]}
          </td>
        );
      })}
    </tr>
  );
}

TableRow.defaultProps = {
  data: {},
  headers: [],
  onClick: (e) => {
    e.preventDefault();
  },
};

TableRow.propTypes = {
  data: PropTypes.object,
  headers: PropTypes.array,
  onClick: PropTypes.func,
};
export default TableRow;
