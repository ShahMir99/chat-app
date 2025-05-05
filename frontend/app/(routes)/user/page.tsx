import EmptyState from '@/components/empty-state'
import Link from 'next/link'
import React from 'react'

const UserPage = () => {
  return (
    <div className="hidden lg:block lg:pl-[420px] h-full">
      <EmptyState />
    </div>
  )
}

export default UserPage