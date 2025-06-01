// Component for the server sidebar containing server header and channels.

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";


export const ServerSidebar = async ({ serverId }: {serverId: string}) => {
    const profile = await currentProfile();
    
    if (!profile) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type ===ChannelType.TEXT);
    const voiceChannels = server?.channels.filter((channel) => channel.type ===ChannelType.VOICE);
    const videoChannels = server?.channels.filter((channel) => channel.type ===ChannelType.VIDEO);

    const members = server?.members.filter((member) => member.profileId !== profile.id);
    
    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    
    const iconMap = {
        [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
        [ChannelType.VOICE]: <Mic className="mr-2 h-4 w-4" />,
        [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
    }

    const roleIconMap = {
        [MemberRole.GUEST]: null,
        [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
        [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
    }

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader 
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type],
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: voiceChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type],
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type],
                            }))
                        },
                                            {
                            label: "Members",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.username,
                                icon: roleIconMap[member.role],
                            }))
                        }
                    ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        label="Text Channels"
                        role={role}
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        />
                        <div className="space-y-[2px]">
                            {textChannels?.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!voiceChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        label="Voice Channels"
                        role={role}
                        sectionType="channels"
                        channelType={ChannelType.VOICE}
                        />
                        <div className="space-y-[2px]">
                            {voiceChannels?.map((channel) => (
                                <ServerChannel 
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        label="Video Channels"
                        role={role}
                        sectionType="channels"
                        channelType={ChannelType.VIDEO}
                        />
                        <div className="space-y-[2px]">
                            {videoChannels?.map((channel) => (
                                <ServerChannel 
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        label="Members"
                        role={role}
                        sectionType="members"
                        server={server}
                        />
                        <div className="space-y-[2px]">
                            {members?.map((member) => (
                                <ServerMember 
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}