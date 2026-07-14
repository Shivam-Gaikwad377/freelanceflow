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
        >
          Start Timer
        </button>
      )}
    </div>
  );
};
export default ProjectTImer;
