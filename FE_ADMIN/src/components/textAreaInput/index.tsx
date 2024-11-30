import React, { useState, ChangeEvent } from 'react';

interface TextAreaInputProps {
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue: (update: { updateType: string; value: string }) => void;
  updateType: string;
}

const TextAreaInput = ({
  labelTitle,
  labelStyle,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}: TextAreaInputProps) => {
  const [value, setValue] = useState<string>(defaultValue || '');

  const updateInputValue = (val: string): void => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={'label-text text-base-content ' + labelStyle}>{labelTitle}</span>
      </label>
      <textarea
        value={value}
        className="textarea textarea-bordered w-full"
        placeholder={placeholder || ''}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateInputValue(e.target.value)}
      ></textarea>
    </div>
  );
};

export default TextAreaInput;
