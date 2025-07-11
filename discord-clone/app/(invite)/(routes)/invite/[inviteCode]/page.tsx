import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: Promise<{
        inviteCode: string;
    }>;
};

const InviteCodePage = async (props: InviteCodePageProps) => {
    const params = await props.params;

    const profile = await currentProfile();
    const { redirectToSignIn } = await auth();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const serverToJoin = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
        }
    });

    if (!serverToJoin) {
        return redirect("/");
    }

    const server = await db.server.update({
        where: {
            id: serverToJoin.id
        },
        data: {
            members: {
                create: {
                    profileId: profile.id,
                }
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
}
 


export default InviteCodePage;