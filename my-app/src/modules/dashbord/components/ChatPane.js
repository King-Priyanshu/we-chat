import Input from "../../../components/Input"
import maixit from '../../../assets/maixit.svg'
import { useEffect, useRef, useState } from "react"
// import Messages from "../../../../server/models/Messages";
import MessageBox from "../MessageBox";
import MessageBox2 from './MessageBox2';
import { WelcomePane } from "./WelcomePane";
import { socket } from "../../../sio";
import Avatar from '../../../assets/Avatar.svg'


export function ChatPane({ activeContactData, messages, setMessages }) {

  const [messageText, setMessageText] = useState('');
  const [activeMessageData, setActiveMessageData] = useState([]);

  const chatPaneRef = useRef(null);

  const messageBoxRef = useRef(null);

  function handleMessageInputChange(value) {
    setMessageText(value)
  }

  useEffect(() => {
    if (activeContactData.id) {
      setActiveMessageData(messages[activeContactData.id])
    }
  }, [activeContactData, messages]);

  function handleSendClick() {
    if (messageText !== '') {
      let latestMessageId = 0;
      if (messages[activeContactData.id]) {
        latestMessageId = messages[activeContactData.id][messages[activeContactData.id].length - 1].id;
      }
      const messageObj = { text: messageText, isMyMessage: true, id: latestMessageId + 1, timestamp: new Date() }
      setMessages((prevMessages) => {
        let prevConversation = [];
        if (prevMessages[activeContactData.id]) {
          prevConversation = prevMessages[activeContactData.id];
        }
        const newConversation = { [activeContactData.id]: [...prevConversation, messageObj] };
        return {
          ...prevMessages,
          ...newConversation
        }
      })


      const theMessage = {message: messageText, timestamp: messageObj.timestamp, id: messageObj.id}
      socket.emit('sendMessage', {messageObj: theMessage, receiverId: activeContactData.id})
      setMessageText('');
    }
  }

  useEffect(() => {
    if (chatPaneRef && chatPaneRef.current) {
      chatPaneRef.current.scrollTop = chatPaneRef.current.scrollHeight;
    }
  }, [activeContactData, messages, chatPaneRef]);

  useEffect(() => {
    if (messageBoxRef && messageBoxRef.current) {
      messageBoxRef.current.focus();
    }
  }, [activeContactData, messageBoxRef]);

  function handleSendByKey() {
    handleSendClick();
  }

  return (
    <div className='w-[75%] h-screen bg-white flex flex-col items-center shadow-lg'>

      {
        activeContactData.id ?
          (
            <>
              <div className='w-[75%] bg-ternary h-[60px] mt-14 rounded-full flex items-center'>
                <div className='cursor-pointer'><img src={activeContactData.pfp?activeContactData.pfp:Avatar} width={60} height={60} className="rounded-full" alt='maixit' /></div>
                <div className='ml-3 mr-auto'>
                  <h3 className='text-3xl semi-bold'>{activeContactData.fullName}</h3>
                  <h5 className='font-light text-sm'>{activeContactData.status}</h5>
                </div>

                <div className='cursor-pointer p-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                    <path d="M15 9l5 -5" />
                    <path d="M16 4l4 0l0 4" />
                  </svg>
                </div>
              </div>
              <div className='h-[75%] w-full border-b overflow-y-scroll' ref={chatPaneRef}>
                <div className='p-14'>
                  {
                    activeMessageData ?
                      (activeMessageData.map((message) => {
                        return (
                          <div key={message.id}>
                            <MessageBox message={message} isMyMessage={message.isMyMessage} />
                          </div>
                        )
                      }))
                      : ('')
                  }
                  {/* Add more messages here as needed */}
                </div>
              </div>
              <div className='w-full flex items-center shadow-lg border-1px'>
                <Input theref={messageBoxRef} onSendByKey={handleSendByKey} value={messageText} className='p-14 w-[80%]' placeholder='Enter your message......' InputclassName='py-2 border-0 shadow-lg rounded-full bg-inputbar' onInputChange={handleMessageInputChange} />
                <div className='ml-4 p-2 px-4 m-2 cursor-pointer bg-mymassage rounded-full hover:bg-mymessage' onClick={handleSendClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 14l11 -11" />
                    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                  </svg>
                </div>
                <div className='ml-4 p-2 m-2 cursor-pointer bg-mymassage rounded-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                  </svg>
                </div>
              </div>
            </>
          )
          :(<WelcomePane />)
      }

    </div>

  )
}