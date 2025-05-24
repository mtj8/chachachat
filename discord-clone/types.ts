import { Server, Member, Profile } from '@prisma/client';

// This type is used for a server including its members and profiles.
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
}