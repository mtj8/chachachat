import { Server, Member, Profile } from '@prisma/client';

export type ServerWitheMembersWithProfiles = Server & {
    members: (Member & { profile: Profile})[];
}