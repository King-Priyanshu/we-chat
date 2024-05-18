import Avatar from '../../assets/Avatar.svg'
import riya from '../../assets/riya.svg'
import lalit from '../../assets/lalit.svg'
import maixit from '../../assets/maixit.svg'
import Don from '../../assets/Don.svg'
import aman from '../../assets/aman.svg'
import React, { useEffect, useState } from 'react'
import Input from '../../components/Input'
import { useNavigate } from 'react-router-dom'
import { ContactCard } from './components/ContactCard'
import { ChatPane } from './components/ChatPane'

const Dashboard = () => {
  const [userData, setUserData] = useState({ username: null, email: null })
  const [conversation, setConversation] = useState([])

  const [activeContactData, setActiveContactData] = useState({});

  const navigate = useNavigate()

  const [messages, setMessages] = useState({
    '663bc3089f4189f14f6453c3': [
      {id: 1, text: 'hi', isMyMessage: false, timestamp: new Date()},
      {id: 2, text: 'hello', isMyMessage: true, timestamp: new Date()}
    ]
  })


  const contects = [
    {
      name: 'Riya',
      status: 'available',
      img: riya
    },
    {
      name: 'Lalit',
      status: 'available',
      img: lalit
    },
    {
      name: 'Maixit',
      status: 'available',
      img: maixit
    },
    {
      name: 'Aman',
      status: 'available',
      img: aman
    },
    {
      name: 'Don',
      status: 'available',
      img: Don
    },
    {
      name: 'Moksha',
      status: 'available',
      img: riya
    },
    {
      name: 'Tumhare janne wala no.6',
      status: 'available',
      img: Avatar
    },
  ]

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user:user'))
    // console.log(loggedInUser.id)

    const fetchConversation = async () => {
      if (loggedInUser) {
        try {
          const res = await fetch(`http://localhost:8000/api/users`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
            }
          });
          const resData = await res.json()
          // console.log('resData :>> ', resData)
          setConversation(resData)
        } catch (error) {
          console.error('Error fetching conversations:', error)
        }
      }
    }
    fetchConversation()
  }, []);

  useEffect(() => {
    async function getUserData() {
      try {
        const token = localStorage.getItem('user:token');
        const res = await fetch(`http://localhost:8000/api/getUserData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });

        const data = await res.json();
        if (res.ok) {
          setUserData(data.userData);
        }
      } catch (e) {
        console.error('Error fetching user data:', e);
      }
    }

    if (!localStorage.getItem('user:token')) {
      navigate('/user/sign_in');
    }

    getUserData();



  }, []);


  function handleContactClick(user) {
    // console.log(user)
    setActiveContactData({ id: user.id, fullName: user.fullName, email: user.email });
  }

  function handleLogoutClick(){
    localStorage.removeItem('user:token');
    navigate('/user/sign_in');
  }



  const user = JSON.parse(localStorage.getItem('user:detail'))

  // console.log('user :>> ', user)



  return (
    <div className='w-screen flex'>
      <div className='w-[25%] h-screen overflow-scroll'>
        
        <div className='flex items-center my-8 mx-14'>
          
          <div className='border border-primary p-[2px] rounded-full'>
            <img src={Avatar} width={100} height={100} alt='Avatar' />
          </div>
          
          <div className='ml-4'>
            <h3 className='text-2xl'>{userData ? userData.username : 'loading...'}</h3>
            <p className='text-lg font-light'>My Account</p>
            <div className='bg-mymessage flex justify-center items-center h-8 text-white cursor-pointer border border-message' onClick={handleLogoutClick}>
              Logout
          </div>
          </div>
        </div>
        <hr />
        <div className='mx-14 mt-10'>
          <div className='text-primary text-lg'>Messages</div>
          <div>
            {
              conversation.map((convo) => {
                // console.log(convo)
                // console.log(convo.user)
                return (
                  <div key={convo.user.id}>
                    <ContactCard user={convo.user} onContactClick={handleContactClick} />
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      <ChatPane activeContactData={activeContactData} messages={messages} setMessages={setMessages} />

      <div className='w-[25%] h-screen'>
        hlo
      </div>
    </div>
  )
}

export default Dashboard
