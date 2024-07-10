"use server";

import { revalidatePath } from "next/cache";
import { updateUserProps } from "@/constants";
import { FilterQuery, SortOrder } from "mongoose";

import { connectDB } from "../mongoose";

import Thread from "../models/thread.model";
import User from "../models/user.model";

export async function UpdateUser({
    userId,
    username,
    name,
    image,
    bio,
    path
}: updateUserProps): Promise<void> {

    connectDB();
    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLocaleLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);

    }
}

export async function fetchUser(userId: string) {
    try {
        connectDB();

        return await User
            .findOne({ id: userId })
        // .populate({
        //     path: 'community',
        //     model: Community
        // })

    } catch (error: any) {
        throw new Error(`Failed to fetch user ${error.message}`);

    }
}

export async function fetchUserPosts(userId: string) {

    try {
        connectDB();

        // find all threads by user

        // todo: populate community
        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            })

        return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts ${error.message}`);
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectDB();

        const skipAmt = (pageNumber - 1) * pageSize; //pagination

        const regex = new RegExp(searchString, "i"); //case-insensitive search

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId } //filtering out the current user
        }

        if (searchString.trim() != '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        } //search by username or name

        const sortOptions = { createdAt: sortBy }

        const UserQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmt)
            .limit(pageSize);

        const totalUserCount = await User.countDocuments(query);

        const users = await UserQuery.exec();

        const isnext = totalUserCount > skipAmt + users.length;

        return { users, isnext };
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}

export async function getActivity(userId: string) {
    try {
        connectDB();

        //find all threads created  by user
        const userThreads = await Thread.find({ author: userId });

        //collect all the child thread Id's
        const childThread = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, [])

        const replies = await Thread.find({
            _id: { $in: childThread },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;
    } catch (error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`);
    }
}