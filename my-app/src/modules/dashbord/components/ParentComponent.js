import React, { useState } from 'react';
import MessageBox2 from './MessageBox2';

const ParentComponent = () => {
  const [inputValue, setInputValue] = useState('');


  const handleInputChange = (e) => {
    if (e && e.target && e.target.value) {
      setInputValue(e.target.value);
    }
}

  return (
    <div>
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleInputChange} 
        placeholder="Type your message..." 
      />
      <MessageBox2 message={inputValue} />
    </div>
  );
}

export default ParentComponent;
