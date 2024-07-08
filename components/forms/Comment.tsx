"use client";

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { Commentvalidation } from '@/lib/validations/thread';
import { addCommentToThread } from '@/lib/actions/thread.action';

import { CommentProps } from '@/constants'
import React from 'react'
import Image from 'next/image';
import { currentUser } from '@clerk/nextjs/server';

const Comment = ({ threadId, userImg, userId }: CommentProps) => {

    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof Commentvalidation>>({
        resolver: zodResolver(Commentvalidation),
        defaultValues: {
            thread: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof Commentvalidation>) => {
        await addCommentToThread(threadId, values.thread, JSON.parse(userId), pathname);

        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={userImg}
                                    alt='profile-img'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover' />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    placeholder='add a comment...'
                                    className='no-focus text-light-1 outline-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='comment-form_btn'>Reply</Button>
            </form>
        </Form>
    )
}

export default Comment