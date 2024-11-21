import React from 'react';

interface IInput {
  placeholder: string;
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
const Input = (props: IInput) => {
  const [hasValue, setHasValue] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setHasValue(!!inputValue); // Kiểm tra nếu có giá trị, thì set hasValue thành true
    props.onChange(e); // Gọi hàm onChange nếu đã được định nghĩa
  };
  const inputClassName = `field ${hasValue ? 'field-active field-show-floating-label' : ''}`;
  return (
    <div className={inputClassName}>
      <div className="field-input-wrapper">
        <label className="field-label" htmlFor={`billing_address_${props.id}`}>
          {props.placeholder}
        </label>
        <input
          placeholder={props.placeholder}
          autoCapitalize="off"
          spellCheck="false"
          className="field-input"
          type="text"
          id={`billing_address_${props.id}`}
          name={`billing_address[${props.id}]`}
          autoComplete="false"
          onChange={handleInputChange}
          value={props.value}
        />
      </div>
    </div>
  );
};
export default Input;
