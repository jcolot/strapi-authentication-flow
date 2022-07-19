/**
 *
 * InputFileWithErrors
 *
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { differenceBy, isEmpty } from 'lodash';

// Design
import Label from '../Label';
import InputDescription from '../InputDescription';
import InputFile from '../InputFile';

import './styles.scss';

const InputFileWithErrors = (props) => {

  const [label, setLabel] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    if (props.multiple && !isEmpty(props.value)) {
      setLabel(1);
      setHasValue(true);
    }
  }, []);


  const previousValue = useRef(props.value); 

  useEffect(() => {
    if (!hasValue && !isEmpty(props.value) && props.multiple && differenceBy(props.value, previousValue.current, 'name').length > 0) {
      setLabel(1);
      setHasValue(true);
      previousValue.current = props.value;
    }
  });

  const labelClass = props.labelClassName === '' ? 'labelFile' : props.labelClassName;

  return (
    <div
      className={cn(
        'inputFileWithErrorsContainer',
        props.customBootstrapClass,
        props.className !== '' && props.className,
      )}
      style={props.style}
    >
      <div className="labelContainer">

        <Label
          className={labelClass}
          htmlFor={`${props.name}NotNeeded`}
          message={props.label}
          style={props.labelStyle}
        />
        {label && (
          <span className="labelNumber">&nbsp;({label}/{props.value.length})</span>
        )}
      </div>
      <InputFile
        multiple={props.multiple}
        name={props.name}
        onChange={props.onChange}
        setLabel={setLabel}
        value={props.value}
      />
      <InputDescription
        className={props.inputDescriptionClassName}
        message={props.inputDescription}
        style={props.inputDescriptionStyle}
      />
    </div>
  );
}

InputFileWithErrors.defaultProps = {
  className: '',
  customBootstrapClass: 'col-md-6',
  inputDescription: '',
  inputDescriptionClassName: '',
  inputDescriptionStyle: {},
  label: '',
  labelClassName: '',
  labelStyle: {},
  multiple: false,
  style: {},
  value: [],
};

InputFileWithErrors.propTypes = {
  className: PropTypes.string,
  customBootstrapClass: PropTypes.string,
  inputDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  inputDescriptionClassName: PropTypes.string,
  inputDescriptionStyle: PropTypes.object,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({
      id: PropTypes.string,
      params: PropTypes.object,
    }),
  ]),
  labelClassName: PropTypes.string,
  labelStyle: PropTypes.object,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default InputFileWithErrors;
