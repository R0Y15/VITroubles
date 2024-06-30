"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectDB } from "../mongoose";
import { updateUserProps } from "@/constants";

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