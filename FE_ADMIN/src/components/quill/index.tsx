import React, { Component, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

import './styles.css';

interface EditorProps {
  placeholder: string;
  onChange: any;
  value: string;
}

Quill.register('modules/imageResize', ImageResize);

const Editor = (props: EditorProps) => {
  return (
    <ReactQuill
      theme="snow"
      onChange={props.onChange}
      value={props.value}
      modules={Editor.modules}
      formats={Editor.formats}
      bounds="#root"
      placeholder={props.placeholder}
    />
  );
};

Editor.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ direction: 'rtl' }, { align: [] }],
    ['link', 'image', 'video', 'formula'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize'],
  },
};

Editor.formats = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'script',
  'header',
  'blockquote',
  'code-block',
  'indent',
  'list',
  'direction',
  'align',
  'link',
  'image',
  'video',
  'formula',
];

export default Editor;
