import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Tiny component for displaying user avatars.

interface UserAvatarProps {
    src?: string;
    className?: string;
}

export const UserAvatar = ({
    src,
    className,
}: UserAvatarProps) => {
    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
            <AvatarImage src={src} />
        </Avatar>
    )
}