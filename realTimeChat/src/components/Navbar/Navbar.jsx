import React from 'react'

const Navbar = ({username}) => {
  return (
    <nav>
      <div className='pl-5 pt-2 pb-2 bg-slate-100'>
        <h2 className='font-bold text-2xl '>{username}</h2>
        <h5>10 online</h5>
      </div>
    </nav>
  )
}

export default Navbar
