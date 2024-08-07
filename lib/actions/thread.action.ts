"use server";

import { ThreadProps } from "@/constants";
import { connectDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";

try {
    connectDB();
} catch (error) {
    console.error("Error connecting to database:", error);
}

export async function createThread({ text, author, communityId, path }: ThreadProps) {
    try {
        // connectDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const createdThread = await Thread.create({
            text,
            author,
            community: communityIdObject,
        });

        // update user threads
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        });

        if (communityIdObject) {
            // Update Community model
            await Community.findByIdAndUpdate(communityIdObject, {
                $push: { threads: createdThread._id },
            });
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error Creating a Thread: ${error.message}`);

    }

};

export async function getThreads(pageNumber = 1, pageSize = 20) {

    // connectDB();

    // cal no of pages to skip
    const skipAmt = (pageNumber - 1) * pageSize;


    // fetching parent(top level thread)
    const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmt)
        .limit(pageSize)
        .populate({
            path: 'author',
            model: User
        })
        .populate({
            path: "community",
            model: Community,
        })
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

export async function fetchThreadById(id: string) {
    // connectDB();

    try {
        // todo: populate community
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: 'User',
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }).exec();

        return thread;
    } catch (error: any) {
        throw new Error(`Error Fetching Thread: ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    // connectDB();

    try {
        const originalThread = await Thread.findById(threadId); //find the original thread by its ID

        if (!originalThread) {
            throw new Error('Thread not found');
        }

        //create a thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        //save the comment thread
        const savedCommmentThread = await commentThread.save();

        //update the original thread to include the comment thread
        originalThread.children.push(savedCommmentThread._id);

        // saving the original thread
        await originalThread.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error Adding Comment to Thread: ${error.message}`)
    }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
    const childThreads = await Thread.find({ parentId: threadId });

    const descendantThreads = [];
    for (const childThread of childThreads) {
        const descendants = await fetchAllChildThreads(childThread._id);
        descendantThreads.push(childThread, ...descendants);
    }

    return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
    try {
        // connectDB();

        // Find the thread to be deleted (the main thread)
        const mainThread = await Thread.findById(id).populate("author community");

        if (!mainThread) {
            throw new Error("Thread not found");
        }

        // Fetch all child threads and their descendants recursively
        const descendantThreads = await fetchAllChildThreads(id);

        // Get all descendant thread IDs including the main thread ID and child thread IDs
        const descendantThreadIds = [
            id,
            ...descendantThreads.map((thread) => thread._id),
        ];

        // Extract the authorIds and communityIds to update User and Community models respectively
        const uniqueAuthorIds = new Set(
            [
                ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainThread.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        const uniqueCommunityIds = new Set(
            [
                ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainThread.community?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        // Recursively delete child threads and their descendants
        await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

        // Update User model
        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            { $pull: { threads: { $in: descendantThreadIds } } }
        );

        // Update Community model
        await Community.updateMany(
            { _id: { $in: Array.from(uniqueCommunityIds) } },
            { $pull: { threads: { $in: descendantThreadIds } } }
        );

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete thread: ${error.message}`);
    }
}