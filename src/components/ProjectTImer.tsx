import React from "react";
import { useTimerStore } from "@/store/useTimerStore";
import { useElapsedSeconds } from "@/app/hooks/useElapsedSeconds";
import { formatDuration, startTimer } from "@/helpers/timerHelper";

const ProjectTImer = ({ projectId }: { projectId: string }) => {
  const activeTimer = useTimerStore((s) => s.activeTimer);
  const isRunningHere = !!activeTimer && activeTimer.projectId === projectId;

  const elapsed = useElapsedSeconds(
    isRunningHere ? activeTimer?.startTime : null
  );

  return (
    <div>
      {isRunningHere ? (
        <span>{formatDuration(elapsed)} · running</span>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            startTimer(projectId);
          }}
          className="cursor-pointer w-auto h-auto  flex items-center justify-center gap-2 px-4  bg-surface border border-outline-variant text-on-surface-variant hover:text-primary transition-colors  rounded-lg  text-label-md py-3 shadow-sm"
        >
          Start Timer
        </button>
      )}
    </div>
  );
};
export default ProjectTImer;
