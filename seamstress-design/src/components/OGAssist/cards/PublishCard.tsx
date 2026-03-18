import React from 'react';
import { Box, Card, Typography, Stack, LinearProgress, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupsIcon from '@mui/icons-material/Groups';

interface PublishStatus {
  step: string;
  status: 'pending' | 'in-progress' | 'completed';
  details?: string;
}

interface PublishCardProps {
  statuses: PublishStatus[];
  summary?: {
    workOrders: number;
    crewsNotified: number;
    notifications: number;
    documents: number;
  };
}

export const PublishCard: React.FC<PublishCardProps> = ({ statuses, summary }) => {
  const completedCount = statuses.filter(s => s.status === 'completed').length;
  const progress = (completedCount / statuses.length) * 100;

  return (
    <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <SendIcon sx={{ fontSize: 24, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Publishing Schedule
          </Typography>
        </Stack>

        {/* Progress */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {completedCount} of {statuses.length} steps
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
              },
            }}
          />
        </Box>

        {/* Status List */}
        <List sx={{ py: 0 }}>
          {statuses.map((status, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {status.status === 'completed' ? (
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                ) : status.status === 'in-progress' ? (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid #4b3fff',
                      borderTopColor: 'transparent',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: 'grey.300',
                    }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={status.step}
                secondary={status.details}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: status.status === 'in-progress' ? 600 : 400,
                }}
                secondaryTypographyProps={{
                  fontSize: '12px',
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Summary */}
        {summary && progress === 100 && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'success.light',
              border: '1px solid',
              borderColor: 'success.main',
            }}
          >
            <Stack spacing={2}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                Publication Complete!
              </Typography>
              <Stack direction="row" spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AssignmentTurnedInIcon sx={{ fontSize: 16, color: 'success.dark' }} />
                  <Typography variant="caption">{summary.workOrders} work orders</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GroupsIcon sx={{ fontSize: 16, color: 'success.dark' }} />
                  <Typography variant="caption">{summary.crewsNotified} crews</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <NotificationsActiveIcon sx={{ fontSize: 16, color: 'success.dark' }} />
                  <Typography variant="caption">{summary.notifications} notifications</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
};

export const NotificationCard: React.FC<{
  title: string;
  channels: Array<{ type: 'email' | 'sms' | 'app' | 'document'; count: number }>;
  recipients: string[];
}> = ({ title, channels, recipients }) => {
  const iconMap = {
    email: EmailIcon,
    sms: SmsIcon,
    app: PhoneAndroidIcon,
    document: DescriptionIcon,
  };

  return (
    <Card sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
      <Stack spacing={2}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Stack direction="row" spacing={2}>
          {channels.map((channel, index) => {
            const Icon = iconMap[channel.type];
            return (
              <Chip
                key={index}
                icon={<Icon sx={{ fontSize: 14 }} />}
                label={`${channel.count}`}
                size="small"
                sx={{
                  bgcolor: 'white',
                  '& .MuiChip-icon': {
                    color: 'primary.main',
                  },
                }}
              />
            );
          })}
        </Stack>

        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Recipients: {recipients.join(', ')}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

