import React from 'react';

const Input = ({
  label = '',
  name = '',
  type = 'text',
  className = '',
  InputclassName = '',
  isRequired = false,
  placeholder = '',
  value,
  onInputChange,
  theref,
  onSendByKey
}) => {
  // Function to handle input changes
  const handleInputChange = (e) => {
    // Get the new value from the input field
    const newValue = e.target.value;
    // Call the onInputChange function passed as prop with the new value
    onInputChange(newValue);
  };

  const handleSendByKey = (e) => {
    // Get the new value from the input field
    const key = e.key;
    console.log(key)
    if(key==='Enter'){
      // Call the onInputChange function passed as prop with the new value
      onSendByKey();
    }
  };

  return (
    <div className={`w-[1/2] ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label}</label>
      <input
        ref={theref}
        onKeyDown={handleSendByKey}
        type={type}
        id={name}
        onChange={handleInputChange}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${InputclassName}`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
      />
    </div>
  );
}

export default Input;
