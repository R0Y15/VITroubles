import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchUser } from '@/lib/actions/user.action';
import { PostThread } from '@/components/forms';

const page = async () => {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    return (
        <>
            <h1 className="head-text">
                Create Thread
            </h1>

            <PostThread userId={userInfo._id} />
        </>
    )
}

export default page