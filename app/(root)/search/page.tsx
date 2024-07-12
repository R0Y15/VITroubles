import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchUser, fetchUsers } from '@/lib/actions/user.action';
import { ProfileHeader, ThreadsTab } from '@/components/shared';
import Image from 'next/image';
import { UserCard } from '@/components/cards';

const page = async () => {

    const user = await currentUser(); //fetch current user
    if (!user) redirect('/sign-in');

    const userInfo = await fetchUser(user.id); //fetch user info
    if (!userInfo?.onboarded) redirect('/onboarding'); //check for user login status

    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 20,
    })

    return (
        <section>
            <h1 className='head-text mb-10'>
                Search
            </h1>

            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className='no-result'>No Users</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                image={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default page