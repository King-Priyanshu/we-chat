export function ContactCard({ user, onContactClick }) {
    return (
        <div onClick={()=>onContactClick(user)} className='flex items-center py-2 border-b border-b-gray-300' key={user.name}>
            <div className='cursor-pointer flex'>
                <div><img src={''} width={50} height={50} alt={user.fullName} /></div>
                <div className='ml-5'>
                    <h3 className='text-lg semi-bold'>{user.email}</h3>
                    <p className='text-sm font-light text-grey-600'>{user.fullName}</p>
                </div>
            </div>
        </div>
    )
}