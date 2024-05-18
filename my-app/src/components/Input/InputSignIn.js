import React from 'react';

const InputSignIn = ({
  label = '',
  name = '',
  type = 'text',
  className = '',
  InputclassName = '',
  isRequired = false,
  placeholder = '',
  value,
  onChange
}) => {

  return (
    <div className={`w-[1/2] ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label}</label>
      <input
        type={type}
        id={name}
        onChange={onChange}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${InputclassName}`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
      />
    </div>
  );
}

export default InputSignIn;
