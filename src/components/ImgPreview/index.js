/**
 *
 *
 * ImgPreview
 *
 */

import React from 'react';
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { get, has, isArray, isEmpty, size } from 'lodash';
import cn from 'classnames';

import BkgImg from '../../assets/icons/icon_upload.svg';
import ImgPreviewArrow from '../ImgPreviewArrow';
import ImgPreviewHint from '../ImgPreviewHint';

import './styles.scss';

/* eslint-disable no-mixed-operators */
/* eslint-disable  no-unused-vars */
/* eslint-disable  jsx-a11y/alt-text */
const ImgPreview = (props) => {

  const [imgURL, setImgURL] = useState('');
  const [isImg, setIsImg] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [isOverArrow, setIsOverArrow] = useState(false);
  const [isInitValue, setIsInitValue] = useState(false);

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      const lastFile = props.multiple ? props.files.slice(-1)[0] : props.files[0] || props.files;
      const file = props.multiple ?
        get(props.files, [props.files.length - 1, 'attributes'], '') :
        get(props.files, [props.position, 'attributes'], '') || get(props.files, 'attributes', '');

      if (lastFile) {
        generateImgURL(lastFile);
      }

      if (props.multiple) {
        updateFilePosition(Math.max(0, props.files.length - 1));
      }
      didMount.current = true;
    }
  }, [props.isUploading]);

  // Update the preview or slide pictures
  useEffect(() => {
    const file = get(props.files, [props.position, 'attributes'], '') || get(props.files, 'attributes', '');
    generateImgURL(file);
  }, [props.didDeleteFile, props.position, props.files]);

  const getFileType = (fileName) => fileName.split('.').slice(-1)[0];
  const isPictureType = (fileName) => /\.(jpe?g|png|gif)$/i.test(fileName);


  /**
   * [generateImgURL description]
   * @param  {FileList} files
   * @return {URL}
   */
  const generateImgURL = (file) => {
    if (isPictureType(file.name) && !has(file, 'url')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgURL(reader.result);
        setIsImg(true);
        console.log('here');
      }
      reader.readAsDataURL(file);
    } else if (has(file, 'url')) {
      setIsImg(isPictureType(file.name));
      setImgURL(file.url[0] === '/' ? `${process.env.REACT_APP_STRAPI_HOST}${file.url}` : file.url);
    } else {
      setIsImg(false);
      setImgURL(file.name);
    }
  }

  const handleClick = (type) => {
    const { files, position } = props;
    let file;
    let nextPosition;

    switch (type) {
      case 'right':
        file = files[position + 1] || files[0];
        nextPosition = files[position + 1] ? position + 1 : 0;
        break;
      case 'left':
        file = files[position - 1] || files[files.length - 1];
        nextPosition = files[position - 1] ? position - 1 : files.length - 1;
        break;
      default:
      // Do nothing
    }

    // Update the parent position
    updateFilePosition(nextPosition);
  }

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDrop = (e) => {
    setIsDragging(false);
    props.onDrop(e);
  }

  const renderContent = () => {

    const fileType = getFileType(imgURL);
    console.log(isEmpty(imgURL));
    if (isImg) {
      return (
        <img src={imgURL} />
      );
    }

    return (
      <div className="fileIcon" onDrop={handleDrop}>
        <i className={`fa fa-file-${fileType}-o`} />
      </div>
    );
  }

  const updateFilePosition = (newPosition) => {
    props.updateFilePosition(newPosition);
  }


  const { files, onBrowseClick } = props;

  const containerStyle = isEmpty(imgURL) ?
    {
      backgroundImage: `url(${BkgImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      zIndex: 9999,
    } : {};

  return (
    <div
      className={cn(
        "imgPreviewContainer",
      )}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      style={containerStyle}
    >
      <div
        className={cn(isDragging && "overlay")}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      <ImgPreviewHint
        displayHint={isEmpty(files)}
        onClick={onBrowseClick}
        onDrop={handleDrop}
        showWhiteHint={isDragging || isEmpty(files)}
      />
      {!isEmpty(imgURL) && renderContent()}

      <ImgPreviewArrow
        enable={isArray(files) && size(files) > 1}
        onClick={handleClick}
        onMouseEnter={(e) => setIsOverArrow(true)}
        onMouseLeave={(e) => setIsOverArrow(false)}
        show={isArray(files) && size(files) > 1}
        type="right"
      />

      <ImgPreviewArrow
        enable={isArray(files) && size(files) > 1}
        onClick={handleClick}
        onMouseEnter={(e) => setIsOverArrow(true)}
        onMouseLeave={(e) => setIsOverArrow(false)}
        show={isArray(files) && size(files) > 1}
      />
    </div>

  );
}

ImgPreview.defaultProps = {
  didDeleteFile: false,
  files: [],
  isUploading: false,
  multiple: false,
  name: '',
  onBrowseClick: () => { },
  onChange: () => { },
  onDrop: () => { },
  position: 0,
  updateFilePosition: () => { },
};

ImgPreview.propTypes = {
  didDeleteFile: PropTypes.bool,
  files: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  isUploading: PropTypes.bool,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  onBrowseClick: PropTypes.func,
  onChange: PropTypes.func,
  onDrop: PropTypes.func,
  position: PropTypes.number,
  updateFilePosition: PropTypes.func,
};

export default ImgPreview;
