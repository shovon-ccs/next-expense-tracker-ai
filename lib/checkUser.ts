import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
    const user = await currentUser();
    if (!user) {
        return null;
    }

    let loggedInUser = await db.user.findUnique({
        where: {
            clerkUsserId: user.id,
        },
    });

    if (loggedInUser) {
        return loggedInUser;
    }

    const newUser = await db.user.create({
        data: {
            clerkUsserId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0]?.emailAddress || "",
        },
    });

    return newUser;
}