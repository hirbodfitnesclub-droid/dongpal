import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useDongi } from "@/store/dongi";

export function CreateGroup({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const createGroup = useDongi((s) => s.createGroup);
  const [name, setName] = useState("");
  const [member, setMember] = useState("");
  const [members, setMembers] = useState<string[]>(["تو"]);

  function addMember() {
    const t = member.trim();
    if (!t) return;
    setMembers((m) => [...m, t]);
    setMember("");
  }

  function submit() {
    const id = createGroup(name || "دورهمی جدید", members);
    onOpenChange(false);
    setName("");
    setMembers(["تو"]);
    void navigate({ to: "/g/$groupId", params: { groupId: id } });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
          <DrawerTitle>دورهمی جدید</DrawerTitle>
          <DrawerDescription className="mt-1">
            اسم گروه و نفرات را بنویس. بعداً هم می‌شود اضافه کرد.
          </DrawerDescription>
          <Input
            className="mt-5"
            placeholder="مثلاً سفر شمال، خانه، شام جمعه"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="اسم نفر"
              value={member}
              onChange={(e) => setMember(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addMember();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={addMember}>
              افزودن
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {members.map((m, i) => (
              <span
                key={`${m}-${i}`}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-card-2 px-3 text-sm"
              >
                {m}
                {members.length > 1 && (
                  <button
                    type="button"
                    className="text-muted"
                    onClick={() =>
                      setMembers((list) => list.filter((_, idx) => idx !== i))
                    }
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </span>
            ))}
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={submit}>
            بساز
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
