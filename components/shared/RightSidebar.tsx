import Link from 'next/link'
import React from 'react'

const RightSidebar = () => {
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className='text-heading4-medium text-light-1'>Suggested Communities</h3>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
      </div>

      <Link href={'/contact-page'}>
        <p className='text-light-1'>Contact Us</p>
      </Link>

    </section>
  )
}

export default RightSidebar