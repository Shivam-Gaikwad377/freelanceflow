import React from "react";
import { useState } from "react";
import ConfirmationBox from "../confirmationBox";
import ProjectTimer from "../ProjectTImer";
interface ProjectPageProps {
  // Define any props you want to pass to the component here
  projectId: string; // Unique identifier for the project
  title: string; // Project title
  client: string; // Client name
  deadline: string; // Deadline date
  budget: number; // Project budget
  // Optional click handler
  status: "open" | "in progress" | "completed"; // Project status
  // Optional click handler
  onClick?: () => void; // Optional click handler
  onDelete?: () => Promise<void>; // Optional delete handler
}
type style = {
  [key: string]: string;
};
const ProjectCard = ({
  title,
  client,
  deadline,
  onClick,
  onDelete,
  projectId,
}: ProjectPageProps) => {
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const handleConfirm = async () => {
    await onDelete?.();
    setShowConfirmCard(false);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-surface rounded-lg p-lg border border-outline-variant/40 shadow-sm hover:shadow-[0_8px_24px_rgba(96,99,238,0.04)] hover:border-primary/30 transition-all cursor-pointer active:cursor-pointing group"
    >
      
        <div className=" flex justify-between items-center mb-sm">
          <h4 className="text-body-md font-body-md font-semibold text-on-surface mb-1">
            {title}
          </h4>
          <span
            onClick={(e) => {
              e.stopPropagation(); // stops it from reaching the card's onClick
              setShowConfirmCard(true);
            }}
            className="hover:text-primary  duration-200 material-symbols-outlined text-[20px] group-hover:opacity-100 opacity-0 transition-all"
          >
            delete
          </span>
        
        
      </div>
      <p className="text-body-sm font-body-sm text-on-surface-variant mb-md flex items-center gap-xs">
        <span className="material-symbols-outlined text-[16px]">domain</span>{" "}
        {client}
      </p>
      <div className="flex justify-between items-center border-t border-outline-variant/20 pt-md mt-sm">
        <div className="flex items-center gap-xs text-on-surface-variant text-label-sm font-label-sm">
          <span className="material-symbols-outlined text-[14px]">
            calendar_today
          </span>
          {deadline}
        </div>
         <ProjectTimer projectId={projectId} />
        {showConfirmCard && (
          <ConfirmationBox
            message="Are you sure you want to delete this project? "
            message2="Deleting this project will also delete all associated invoices."
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirmCard(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
