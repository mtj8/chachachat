import { Server, Member, Profile } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';


// This type is used for a server including its members and profiles.
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        }
    }
}