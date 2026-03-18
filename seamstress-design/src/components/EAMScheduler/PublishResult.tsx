import React from 'react';
import {
  Box,
  Alert,
  Stack,
  Chip,
  Button,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SyncIcon from '@mui/icons-material/Sync';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DescriptionIcon from '@mui/icons-material/Description';
import type { EAMPublishResult } from '../../types/opengov/eam';

interface PublishResultProps {
  result: EAMPublishResult;
  onViewWorkOrders?: () => void;
  onExportResidentNotice?: () => void;
  onViewDetails?: () => void;
}

export const PublishResult: React.FC<PublishResultProps> = ({
  result,
  onViewWorkOrders,
  onExportResidentNotice,
  onViewDetails
}) => {
  return (
    <Box>
      <Alert
        severity="success"
        icon={<CheckCircleIcon />}
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Schedule Published Successfully
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Plan ID: <strong>{result.planId}</strong> | Published at: {new Date(result.publishedAt).toLocaleString()}
        </Typography>
      </Alert>

      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        <Chip
          icon={<CheckCircleIcon />}
          label={`${result.crewsNotified} Crew notifications sent`}
          color="success"
          variant="outlined"
        />
        {result.mobileSync && (
          <Chip
            icon={<SyncIcon />}
            label="Mobile sync complete"
            color="success"
            variant="outlined"
          />
        )}
        {result.residentNoticeGenerated && (
          <Chip
            icon={<NotificationsActiveIcon />}
            label="Resident notice generated"
            color="success"
            variant="outlined"
          />
        )}
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Work Orders Created
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h2" color="primary.main" sx={{ mr: 2 }}>
                {result.workOrdersCreated}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Work orders have been created and assigned to respective crews
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={onViewWorkOrders}
              fullWidth
            >
              View Work Orders
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Notifications Sent
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary={`${result.notificationsSent.email} emails sent to crew members and supervisors`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SmsIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="SMS Notifications"
                  secondary={`${result.notificationsSent.sms} text messages sent to field crews`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneAndroidIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Mobile App Notifications"
                  secondary={`${result.notificationsSent.mobile} push notifications sent`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DescriptionIcon color="info" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Resident Notice Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A notice for affected residents has been generated and is ready for distribution
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={onExportResidentNotice}
          >
            Export Resident Notice
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Next Steps:</strong>
        </Typography>
        <List dense sx={{ mt: 1 }}>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Crews will receive work orders on their mobile devices"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Equipment has been reserved for scheduled time slots"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Progress tracking will be available in the dashboard"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Resident notices can be posted to the public portal"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onViewDetails}
        >
          View Schedule Details
        </Button>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
        >
          Schedule More Tasks
        </Button>
      </Stack>
    </Box>
  );
};