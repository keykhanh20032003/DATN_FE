import React from 'react';

interface InputTextProps {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  value?: string;
  containerStyle?: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const InputText = ({ labelTitle, labelStyle, type, containerStyle, placeholder, value, onChange }: InputTextProps) => {
  return (
    <div className={`w-full ${containerStyle}`}>
      <label className="">
        <span className={'text-base ' + labelStyle}>{labelTitle}</span>
      </label>
      <input
        type={type || 'text'}
        value={value}
        placeholder={placeholder || ''}
        onChange={onChange}
        className="w-full border h-10 border-black rounded-md pl-3"
      />
    </div>
  );
};

export default InputText;
