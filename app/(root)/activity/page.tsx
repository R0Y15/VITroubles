import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchUser, getActivity } from '@/lib/actions/user.action';
import Link from 'next/link';
import Image from 'next/image';

const page = async () => {

    const user = await currentUser(); //fetch current user
    if (!user) return null;

    const userInfo = await fetchUser(user.id); //fetch user info
    if (!userInfo?.onboarded) redirect('/onboarding'); //check for user login status

    const activity = await getActivity(userInfo._id); //fetch user activity

    return (
        <>
            <h1 className='head-text mb-10'>
                Activity
            </h1>

            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    <>
                        {activity.map((activity) => (
                            <Link
                                key={activity._id}
                                href={`/thread/${activity.parentId}`}
                            >
                                <article className="activity-card">
                                    <Image
                                        src={activity.author.image}
                                        alt='profile Picture'
                                        width={20}
                                        height={20}
                                        className='rounded-full object-cover'
                                    />
                                    <p className='!text-small-regular text-light-1'>
                                        <span className='mr-1 text-primary-500'>
                                            {activity.author.name}
                                        </span>{" "}
                                        Replied to Your Thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className='!text-base-regular text-light-3'>
                        No Activity Yet
                    </p>
                )}
            </section>
        </>
    )
}

export default page