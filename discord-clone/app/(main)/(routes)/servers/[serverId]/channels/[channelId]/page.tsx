import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: Promise<{
        serverId: string;
        channelId: string;
    }>
}


const ChannelIdPage = async (props: ChannelIdPageProps) => {
    const params = await props.params;

    const profile = await currentProfile();
    const redirectToSignIn = () => redirect("/sign-in");

    if (!profile) {
        return redirectToSignIn();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    })

    if (!member || !channel) {
        return redirect('/');
    }

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
            <ChatHeader 
                serverId={channel.serverId}
                name={channel.name}
                type="channel"
            />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        name={channel.name}
                        member={member}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput
                        apiUrl="/api/socket/messages"
                        name={channel.name}
                        type="channel"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />  
                </>
            )}
            {channel.type === ChannelType.VOICE && (
                <MediaRoom 
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom 
                    chatId={channel.id}
                    video={true}
                    audio={true}
                />
            )}
        </div>
     );
}
 
export default ChannelIdPage;