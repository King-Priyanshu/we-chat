import React from 'react';

const MessageBox2 = ({ message }) => {
  return (
    <div className='max-w-[40%] bg-mymessage rounded-t-full rounded-bl-full ml-auto p-4 text-white mb-4'>
      {message}
    </div>
  );
}

export default MessageBox2;
