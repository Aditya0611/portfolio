import React, { createContext, useContext, useState, ReactNode } from "react";
import { Activity, ActivityType, Priority, ActivityStatus } from "@/lib/types";
import { activities as initialActivities } from "@/lib/mock-data";

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id">) => void;
  getActivitiesByLead: (leadId: string) => Activity[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const addActivity = (activityData: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...activityData,
      id: `a${Date.now()}`,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const getActivitiesByLead = (leadId: string) => {
    return activities.filter((a) => a.leadId === leadId).sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, getActivitiesByLead }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
};
