import { startTimer, stopTimer, formatDuration } from "@/helpers/timerHelper";
import { useTimerStore } from "@/store/useTimerStore";
import { useRouter } from "next/navigation";
import { useElapsedSeconds } from "@/app/hooks/useElapsedSeconds";
import SecondaryButton from "./SecondaryButton";

const GlobalTimer = () => {
  const router = useRouter();
  const activeTimer = useTimerStore((s) => s.activeTimer);
  const elapsed = useElapsedSeconds(activeTimer?.startTime ?? null);

  if (!activeTimer) return null;

  const onStop = async () => {
    await stopTimer();
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <span onClick={onStop} className="cursor-pointer material-symbols-outlined">
        stop
      </span>
      <span>{formatDuration(elapsed)}</span>
    </div>
  );
};

export default GlobalTimer;
