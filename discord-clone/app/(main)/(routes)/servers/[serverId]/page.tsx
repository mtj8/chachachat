import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: {
        serverId: string;
    };
}

const ServerIdPage = async (
    { params }: ServerIdPageProps
) => {
    params = await params;

    const profileData = await currentProfile();
    if (!profileData) {
        return redirect("/");
    }
    const profile = profileData;
    const redirectToSignIn = () => redirect("/sign-in");
    
    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                }
            }
        }
    })
    
    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general") {
        return null;
    }
    
    return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
}
 
export default ServerIdPage;