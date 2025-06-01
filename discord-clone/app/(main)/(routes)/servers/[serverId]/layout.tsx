import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async (
    props: {
        children: React.ReactNode;
        params: Promise<{ serverId: string }>;
    }
) => {
    const params = await props.params;

    const {
        children
    } = props;

    const profile = await currentProfile();
    const { redirectToSignIn } = await auth();
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
        }
    })

    if (!server) {
        return redirect("/");
    }

    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={params.serverId}/>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
     );
}
 
export default ServerIdLayout;