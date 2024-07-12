import { fetchCommunities } from '@/lib/actions/community.actions';
import { fetchUser, fetchUsers } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React from 'react'
import { CommunityCard, UserCard } from '../cards';

const RightSidebar = async () => {
  const user = await currentUser(); //fetch current user
  if (!user) return null;

  const userInfo = await fetchUser(user.id); //fetch user info
  if (!userInfo?.onboarded) redirect('/onboarding'); //check for user login status

  const communityResult = await fetchCommunities({
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
  })

  const userResult = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
  })
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className='text-heading4-medium text-light-1'>Suggested Communities</h3>

        {/* for displaying the communitites */}
        <div className="mt-3 flex flex-col">
          {communityResult.communities.length === 0 ? (
            <p className='no-result'>No communities</p>
          ) : (
            <>
              {communityResult.communities.map((community) => (
                <div className="mt-3" key={community.id}>
                  <CommunityCard
                    key={community.id}
                    id={community.id}
                    name={community.name}
                    username={community.username}
                    image={community.image}
                    bio={community.bio}
                    members={community.members}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
        <div className="mt-3 flex flex-col">
          {userResult.users.length === 0 ? (
            <p className='no-result'>No Users</p>
          ) : (
            <>
              {userResult.users.map((person) => (
                <div className="mt-3" key={person.id}>
                  <UserCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    image={person.image}
                    personType='User'
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <Link href={'/contact-page'}>
        <p className='text-light-1'>Contact Us</p>
      </Link>

    </section>
  )
}

export default RightSidebar