import React from 'react'

type Props = {}

function Loader({text}: Props) {
  return (
    <div className='h-screen w-screen fixed top-0 left-0 right-0 bottom-0 bg-gray-700 opacity-70'>
        <div className='min-h-full min-w-full flex justify-center items-center'>
            <div className='bg-white py-5 px-10 rounded-md text-gray-800'>
               <span className='text-gray-900 font-semibold text-2xl'> {text || 'Loading...'} </span> 
            </div>
        </div>
    </div>
  )
}

export default Loader