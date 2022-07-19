/**
 *
 *
 * InputFile
 *
 */

import React, { useState, useRef } from 'react';

import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import ImgPreview from '../ImgPreview';
import InputFileDetails from '../InputFileDetails';

import './styles.scss';

const InputFile = (props) => {
  const [didDeleteFile, setDidDeleteFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [position, setPosition] = useState(0);
  const inputFile = useRef(null);



  const addFilesToProps = (files) => {
    const initAcc = props.multiple ? cloneDeep(props.value) : {};
    const value = Object.keys(files).reduce((acc, current) => {
      console.log(acc);
      if (props.multiple) {
        acc.push(files[current]);
      } else if (current === '0') {
        acc[0] = files[0];
      }

      return acc;
    }, initAcc)

    const target = {
      name: props.name,
      type: 'file',
      value,
    };

    setIsUploading(!isUploading);
    props.onChange({ target });
  }

  const handleChange = ({ target }) => addFilesToProps(target.files);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputFile.current.click();
  }

  const onDrop = (e) => {
    e.preventDefault();
    addFilesToProps(e.dataTransfer.files);
  }

  const handleFileDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove the file from props
    const value = props.multiple ? cloneDeep(props.value) : {};

    // Remove the file from the array if multiple files upload is enable
    if (props.multiple) {
      value.splice(position, 1);
    }
    // Update the parent's props
    const target = {
      name: props.name,
      type: 'file',
      value,
    };

    props.onChange({ target });

    // Update the position of the children
    if (props.multiple) {
      const newPosition = value.length === 0 ? 0 : value.length - 1;
      updateFilePosition(newPosition, value.length);
    }
    setDidDeleteFile(!didDeleteFile);
  }

  const updateFilePosition = (newPosition, size = props.value.length) => {
    const label = size === 0 ? false : newPosition + 1;
    props.setLabel(label);
    setPosition(newPosition);
  }

  return (
    <div>
      <ImgPreview
        didDeleteFile={didDeleteFile}
        files={props.value}
        isUploading={isUploading}
        multiple={props.multiple}
        name={props.name}
        onChange={props.onChange}
        onBrowseClick={handleClick}
        onDrop={onDrop}
        position={position}
        updateFilePosition={updateFilePosition}
      />
      <label style={{ width: '100%' }}>
        <input
          className="inputFile"
          multiple={props.multiple}
          name={props.name}
          onChange={handleChange}
          type="file"
          ref={inputFile}
        />

        <div className="inputFileButtonContainer">
          <i className="fa fa-plus" style={{ marginRight: '10px', marginBottom: '2px' }} />
          <span style={{ fontSize: '12px' }}>ADD A NEW FILE</span>
        </div>
      </label>
      <InputFileDetails
        file={props.value[position] || props.value[0] || props.value}
        multiple={props.multiple}
        number={props.value.length}
        onFileDelete={handleFileDelete}
      />
    </div>
  );
}

InputFile.defaultProps = {
  multiple: false,
  setLabel: () => { },
  value: [],
};

InputFile.propTypes = {
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  setLabel: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default InputFile;
