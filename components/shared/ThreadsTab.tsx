import { ThreadsTabProps } from '@/constants'
import { fetchUserPosts } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation';
import React from 'react'
import { ThreadCard } from '../cards';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps) => {
  let result: any;

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect('/');

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.threads.map((thread: any) => (

        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentuser={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
          }
          community={thread.community} //todo
          createdAt={thread.createdAt}
          comments={thread.comments}
        />
      ))}
    </section>
  )
}

export default ThreadsTab