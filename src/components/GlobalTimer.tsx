import { startTimer, stopTimer, formatDuration } from "@/helpers/timerHelper";
import { useTimerStore } from "@/store/useTimerStore";
import { useRouter } from "next/navigation";
import  {useElapsedSeconds}  from "@/app/hooks/useElapsedSeconds";




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
      <span>{formatDuration(elapsed)}</span>
      <button onClick={onStop}>Stop</button>
    </div>
  );
}

export default GlobalTimer

