import { AccountProfile } from "@/components/forms";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

async function page() {
    const user = await currentUser();

    const userInfo = {};

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstname || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl,
    }
    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">
                Onboarding
            </h1>

            <p className="mt-3 text-base-regular text-light-2">
                Welcome to the onboarding page. Please click the link below to continue.
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default page;