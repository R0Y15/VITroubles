import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchUser } from '@/lib/actions/user.action';
import { CommunityCard } from '@/components/cards';
import { fetchCommunities } from '@/lib/actions/community.actions';

const page = async () => {

    const user = await currentUser(); //fetch current user
    if (!user) return null;

    const userInfo = await fetchUser(user.id); //fetch user info
    if (!userInfo?.onboarded) redirect('/onboarding'); //check for user login status

    const result = await fetchCommunities({
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
                {result.communities.length === 0 ? (
                    <p className='no-result'>No communities</p>
                ) : (
                    <>
                        {result.communities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                image={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default page