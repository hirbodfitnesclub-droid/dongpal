import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PersonAvatar } from "@/components/person-avatar";
import type { Member } from "@/lib/split";

export function LuckyPicker({
  open,
  onOpenChange,
  members,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  members: Member[];
}) {
  const [current, setCurrent] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Member | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  function spin() {
    if (members.length === 0 || spinning) return;
    setWinner(null);
    setSpinning(true);
    let ticks = 0;
    let idx = current;
    const target = 16 + Math.floor(Math.random() * 8);
    timer.current = window.setInterval(() => {
      ticks += 1;
      idx = (idx + 1) % members.length;
      setCurrent(idx);
      if (ticks >= target) {
        if (timer.current) window.clearInterval(timer.current);
        setSpinning(false);
        setWinner(members[idx] ?? members[0]);
      }
    }, 70);
  }

  const shown = winner ?? members[current];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center">
          <DrawerTitle>کی بده؟</DrawerTitle>
          <DrawerDescription className="mt-1">
            قرعه برای دونگ این دور
          </DrawerDescription>
          {shown && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <PersonAvatar member={shown} size="lg" className="size-20 text-2xl" />
              <p className="text-2xl font-medium">{shown.name}</p>
            </div>
          )}
          <Button
            className="mt-8 w-full"
            size="lg"
            onClick={spin}
            disabled={spinning}
          >
            {spinning ? "در حال چرخش" : winner ? "دوباره" : "بزن"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
