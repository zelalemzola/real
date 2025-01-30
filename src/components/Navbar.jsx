import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='py-3 w-full flex items-center justify-between fixed z-20  mb-20 px-20 bg-white'>
      <h1 className="text-2xl font-bold ">Maya</h1>
      <Link href='/admin/properties' className='bg-primary text-white rounded-2xl px-4 py-2 hover:shadow-2xl'>Admin Panel</Link>
    </div>
  )
}

export default Navbar