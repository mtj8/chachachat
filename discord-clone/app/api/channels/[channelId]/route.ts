import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, props: { params: Promise<{channelId: string}> }) {
    const params = await props.params;
    try {
        const profile = await currentProfile();
        const { name } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID is required", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID is required", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Cannot delete the 'general' channel", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                            id: params.channelId,
                            NOT: { name: "general", },
                    },                    
                }
            }
        });

        return NextResponse.json(server);
    }

    catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500});
    }
}

export async function PATCH(req: Request, props: { params: Promise<{channelId: string}> }) {
    const params = await props.params;
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID is required", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID is required", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: { name: "general", },
                        },
                        data: {
                            name,
                            type,
                        }
                    }
                }
            }
        })

        return NextResponse.json(server);
    }

    catch (error) {
        console.log("[CHANNEL_ID_UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500});
    }
}