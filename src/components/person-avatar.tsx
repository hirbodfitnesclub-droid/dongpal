import { cn } from "@/lib/utils";
import type { Member } from "@/lib/split";

export function PersonAvatar({
  member,
  size = "md",
  className,
}: {
  member: Member;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initial = member.name.trim().charAt(0) || "؟";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium",
        size === "sm" && "size-7 text-xs",
        size === "md" && "size-9 text-sm",
        size === "lg" && "size-12 text-base",
        `tone-${member.tone % 8}`,
        className,
      )}
    >
      {initial}
    </span>
  );
}

export function AvatarStack({ members }: { members: Member[] }) {
  const shown = members.slice(0, 4);
  const extra = members.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((m, i) => (
        <PersonAvatar
          key={m.id}
          member={m}
          size="sm"
          className={cn("ring-2 ring-background", i > 0 && "-mr-2")}
        />
      ))}
      {extra > 0 && (
        <span className="-mr-2 inline-flex size-7 items-center justify-center rounded-full bg-card-2 text-[10px] text-muted ring-2 ring-background">
          +{extra}
        </span>
      )}
    </div>
  );
}
