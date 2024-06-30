"use server";

import { ThreadProps } from "@/constants";
import { connectDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

export async function createThread({ text, author, communityId, path }: ThreadProps) {
    try {
        connectDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        // update user threads
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error Creating a Thread: ${error.message}`);

    }

};

export async function getThreads(pageNumber = 1, pageSize = 20) {

    connectDB();

    // cal no of pages to skip
    const skipAmt = (pageNumber - 1) * pageSize;


    // fetching parent(top level thread)
    const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmt)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }
        })

    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

    const threads = await postQuery.exec();

    const isNext = totalPostsCount > skipAmt + threads.length;

    return { threads, isNext }
}