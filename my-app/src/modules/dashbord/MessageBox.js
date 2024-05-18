import React, { useEffect, useState } from 'react';
import { getDatetimeString } from '../helpers';

const MessageBox = ({ message, isMyMessage }) => {
  const dateObj = new Date(message.timestamp);

  const [showTransition, setShowTranstition] = useState(true);

  useEffect(()=>{
    setTimeout(() => {
      setShowTranstition(false);
    }, 200);
  }, [])

  return (
    <div className={`${showTransition?'opacity-0':'opacity-1'} transition duration-100 ${!isMyMessage ? 'max-w-[40%] bg-message rounded-t-full rounded-br-full p-4 mb-4' : 'max-w-[40%] bg-mymessage rounded-t-full rounded-bl-full ml-auto p-4 text-white mb-4'}`}>
      <div className={`flex ${isMyMessage?'justify-end':''}`}>
        {message.text}
      </div>
      <div className={`flex ${isMyMessage?'':'justify-end'} text-sm`} >
        {getDatetimeString(dateObj)}
      </div>
    </div>
  );
};

export default MessageBox;
