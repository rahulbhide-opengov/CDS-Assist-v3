import React from 'react';
import { Box, Stack, Grid } from '@mui/material';
import { TaskCard } from './cards/TaskCard';
import type { TaskInfo } from './cards/TaskCard';
import { CrewCard } from './cards/CrewCard';
import type { CrewInfo } from './cards/CrewCard';
import { ScheduleCard, ScheduleSummaryCard } from './cards/ScheduleCard';
import type { ScheduleEntry } from './cards/ScheduleCard';
import { PublishCard, NotificationCard } from './cards/PublishCard';
import { ScheduleActions } from './cards/ScheduleActions';
import { AnimateInView } from './AnimateInView';

interface EAMCardRendererProps {
  metadata: any;
  onAction?: (action: string, data?: any) => void;
}

export const EAMCardRenderer: React.FC<EAMCardRendererProps> = ({ metadata, onAction }) => {
  if (!metadata?.cardType || !metadata?.cards) {
    return null;
  }

  const { cardType, cards } = metadata;

  const handleScheduleAccept = () => {
    onAction?.('acceptSchedule', { schedules: cards.schedules });
  };

  const handleScheduleReject = (reason?: string) => {
    onAction?.('rejectSchedule', { reason });
  };

  const handleScheduleModify = () => {
    onAction?.('modifySchedule', {});
  };

  switch (cardType) {
    case 'tasks':
      return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {cards.tasks?.map((task: TaskInfo, index: number) => (
            <Grid size={{ xs: 12, sm: 6 }} key={task.id}>
              <AnimateInView delay={index * 0.1}>
                <TaskCard task={task} />
              </AnimateInView>
            </Grid>
          ))}
        </Grid>
      );

    case 'crews':
      return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {cards.crews?.map((crew: CrewInfo, index: number) => (
            <Grid size={{ xs: 12, md: 6 }} key={crew.id}>
              <AnimateInView delay={index * 0.1}>
                <CrewCard crew={crew} />
              </AnimateInView>
            </Grid>
          ))}
        </Grid>
      );

    case 'schedule':
      return (
        <Stack spacing={3} sx={{ mt: 2 }}>
          {cards.summary && (
            <AnimateInView delay={0}>
              <ScheduleSummaryCard
                totalTasks={cards.summary.totalTasks}
                totalHours={cards.summary.totalHours}
                crewsAssigned={cards.summary.crewsAssigned}
                utilization={cards.summary.utilization}
              />
            </AnimateInView>
          )}
          <Grid container spacing={2}>
            {cards.schedules?.map((schedule: ScheduleEntry, index: number) => (
              <Grid size={{ xs: 12, lg: 6 }} key={schedule.id}>
                <AnimateInView delay={index * 0.15}>
                  <ScheduleCard schedule={schedule} interactive={false} />
                </AnimateInView>
              </Grid>
            ))}
          </Grid>
          {metadata.showActions && (
            <AnimateInView delay={0.3}>
              <ScheduleActions
                onAccept={handleScheduleAccept}
                onReject={handleScheduleReject}
                onModify={handleScheduleModify}
              />
            </AnimateInView>
          )}
        </Stack>
      );

    case 'publish':
      return (
        <Stack spacing={3} sx={{ mt: 2 }}>
          {cards.publishStatus && (
            <PublishCard
              statuses={cards.publishStatus.statuses}
              summary={cards.publishStatus.summary}
            />
          )}
          {cards.notifications && (
            <Grid container spacing={2}>
              {cards.notifications.map((notification: any, index: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <NotificationCard
                    title={notification.title}
                    channels={notification.channels}
                    recipients={notification.recipients}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      );

    default:
      return null;
  }
};