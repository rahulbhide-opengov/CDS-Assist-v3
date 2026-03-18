/**
 * Command Center - Persona-Driven Homepage
 * Action-oriented dashboard that adapts to user's persona
 */

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Payment,
  Autorenew,
  History,
  SupportAgent,
  ChevronRight,
  Warning,
  CheckCircle,
  Schedule,
  Info,
  NotificationsNone,
  ArrowForward,
  Receipt,
  Description,
  Badge,
  Campaign,
  CardGiftcard,
  EventAvailable,
  Upload,
  Search,
  VerifiedUser,
  Send,
  Celebration,
  Assessment,
  PlayArrow,
  Explore,
  MenuBook,
  Park,
  ReportProblem,
  Water,
  Delete,
  AccessTime,
  HourglassEmpty,
  Gavel,
  AccountBalance,
  BarChart,
  Add,
  // New service icons
  WaterDrop,
  Assignment,
  NaturePeople,
  Redeem,
  WorkspacePremium,
  Storefront,
  Flag,
  Home,
  Business,
  Apartment,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { useNavigate } from 'react-router-dom';

// Persona imports
import { usePersona } from '../persona/PersonaContext';
import { PersonaProvider } from '../persona';

// Engine imports
import {
  getPriorityTasks,
  getGreetingMessage,
  urgencyConfig,
  type PriorityTask,
} from '../engines/TaskEngine';
import { getQuickActionsForPersona, type QuickAction } from '../engines/QuickActionsConfig';
import { getServicesForPersona, type ServiceItem } from '../engines/ServicesConfig';

// Navigation
import PortalNavigation from './PortalNavigation';

const colors = capitalDesignTokens.foundations.colors;

// ============================================================================
// ICON MAPPER
// ============================================================================

const iconMap: Record<string, React.ReactElement> = {
  Warning: <Warning aria-hidden="true" />,
  CheckCircle: <CheckCircle aria-hidden="true" />,
  Schedule: <Schedule aria-hidden="true" />,
  Info: <Info aria-hidden="true" />,
  Receipt: <Receipt aria-hidden="true" />,
  Autorenew: <Autorenew aria-hidden="true" />,
  History: <History aria-hidden="true" />,
  Payment: <Payment aria-hidden="true" />,
  Description: <Description aria-hidden="true" />,
  Badge: <Badge aria-hidden="true" />,
  Campaign: <Campaign aria-hidden="true" />,
  CardGiftcard: <CardGiftcard aria-hidden="true" />,
  EventAvailable: <EventAvailable aria-hidden="true" />,
  Upload: <Upload aria-hidden="true" />,
  Search: <Search aria-hidden="true" />,
  VerifiedUser: <VerifiedUser aria-hidden="true" />,
  Send: <Send aria-hidden="true" />,
  Celebration: <Celebration aria-hidden="true" />,
  Assessment: <Assessment aria-hidden="true" />,
  PlayArrow: <PlayArrow aria-hidden="true" />,
  // Service icons
  WaterDrop: <WaterDrop aria-hidden="true" />,
  Assignment: <Assignment aria-hidden="true" />,
  NaturePeople: <NaturePeople aria-hidden="true" />,
  Redeem: <Redeem aria-hidden="true" />,
  WorkspacePremium: <WorkspacePremium aria-hidden="true" />,
  Storefront: <Storefront aria-hidden="true" />,
  Flag: <Flag aria-hidden="true" />,
  Home: <Home aria-hidden="true" />,
  Business: <Business aria-hidden="true" />,
  Apartment: <Apartment aria-hidden="true" />,
  Explore: <Explore aria-hidden="true" />,
  MenuBook: <MenuBook aria-hidden="true" />,
  Park: <Park aria-hidden="true" />,
  ReportProblem: <ReportProblem aria-hidden="true" />,
  Water: <Water aria-hidden="true" />,
  Delete: <Delete aria-hidden="true" />,
  AccessTime: <AccessTime aria-hidden="true" />,
  HourglassEmpty: <HourglassEmpty aria-hidden="true" />,
  Gavel: <Gavel aria-hidden="true" />,
  AccountBalance: <AccountBalance aria-hidden="true" />,
  BarChart: <BarChart aria-hidden="true" />,
  Add: <Add aria-hidden="true" />,
  SupportAgent: <SupportAgent aria-hidden="true" />,
};

const getIcon = (iconName: string, sx?: object): React.ReactElement => {
  const icon = iconMap[iconName] || <Info aria-hidden="true" />;
  return React.cloneElement(icon, { sx });
};

// ============================================================================
// TASK CARD
// ============================================================================

const TaskCard: React.FC<{ task: PriorityTask }> = ({ task }) => {
  const navigate = useNavigate();
  const config = urgencyConfig[task.urgency];

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '12px',
        border: `1px solid ${colors[config.borderColor as keyof typeof colors]}`,
        bgcolor: colors[config.bgColor as keyof typeof colors],
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        height: '100%',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: colors[config.badgeColor as keyof typeof colors],
            color: colors.white,
          }}
        >
          {getIcon(task.icon, { fontSize: 22 })}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: colors.gray900, lineHeight: 1.3 }}>
            {task.title}
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600, lineHeight: 1.3 }}>
            {task.subtitle}
          </Typography>
        </Box>
        {task.amount && (
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: colors[config.textColor as keyof typeof colors] }}>
            ${task.amount.toFixed(2)}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <Button
          variant={task.action.variant === 'primary' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => navigate(task.action.href)}
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8125rem',
            borderRadius: '8px',
            py: 0.75,
            bgcolor: task.action.variant === 'primary' ? colors[config.badgeColor as keyof typeof colors] : 'transparent',
            borderColor: colors[config.badgeColor as keyof typeof colors],
            color: task.action.variant === 'primary' ? colors.white : colors[config.badgeColor as keyof typeof colors],
            '&:hover': {
              bgcolor: task.action.variant === 'primary'
                ? colors[config.textColor as keyof typeof colors]
                : colors[config.bgColor as keyof typeof colors],
            },
          }}
        >
          {task.action.label}
        </Button>
        {task.secondaryAction && (
          <Button
            variant="text"
            size="small"
            onClick={() => navigate(task.secondaryAction!.href)}
            sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.8125rem', color: colors.gray600 }}
          >
            {task.secondaryAction.label}
          </Button>
        )}
      </Box>
    </Card>
  );
};

// ============================================================================
// QUICK ACTION BUTTON
// ============================================================================

const QuickActionButton: React.FC<{ action: QuickAction }> = ({ action }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      onClick={() => navigate(action.href)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${colors.gray200}`,
        bgcolor: colors.white,
        textTransform: 'none',
        minWidth: 100,
        transition: 'all 0.15s',
        '&:hover': {
          bgcolor: colors[action.bgColor as keyof typeof colors],
          borderColor: colors[action.color as keyof typeof colors],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: colors[action.bgColor as keyof typeof colors],
          color: colors[action.color as keyof typeof colors],
        }}
      >
        {getIcon(action.icon, { fontSize: 22 })}
      </Avatar>
      <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray900, lineHeight: 1.2, textAlign: 'center' }}>
        {action.label}
      </Typography>
    </Button>
  );
};

// ============================================================================
// SERVICE CARD
// ============================================================================

const ServiceCard: React.FC<{ service: ServiceItem }> = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(service.href);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(service.href);
    }
  };

  return (
    <Card
      elevation={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${service.label}`}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${colors.gray200}`,
        bgcolor: colors.white,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        transition: 'all 0.15s',
        '&:hover': {
          bgcolor: colors[service.bgColor as keyof typeof colors],
          borderColor: colors[service.color as keyof typeof colors],
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
        '&:focus': {
          outline: `2px solid ${colors.blurple500}`,
          outlineOffset: 2,
        },
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: colors[service.bgColor as keyof typeof colors],
          color: colors[service.color as keyof typeof colors],
        }}
      >
        {getIcon(service.icon, { fontSize: 22 })}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.gray900 }}>
          {service.label}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
          {service.description}
        </Typography>
      </Box>
      <ChevronRight aria-hidden="true" sx={{ color: colors.gray400 }} />
    </Card>
  );
};

// ============================================================================
// PROPERTY CARD
// ============================================================================

interface PropertyCardProps {
  entity: {
    id: string;
    name: string;
    type: string;
    isPrimary?: boolean;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ entity }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/unified-portal/properties/${entity.id}`);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/unified-portal/properties/${entity.id}`);
    }
  };

  const propertyType = entity.type === 'residential_property' ? 'Residential' : 'Business';

  return (
    <Card
      elevation={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${entity.name} ${propertyType} property`}
      sx={{
        p: 1.5,
        minWidth: 200,
        borderRadius: '8px',
        border: `1px solid ${colors.gray200}`,
        bgcolor: colors.gray50,
        cursor: 'pointer',
        transition: 'all 0.15s',
        '&:hover': { bgcolor: colors.white, borderColor: colors.blurple300 },
        '&:focus': {
          outline: `2px solid ${colors.blurple500}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: entity.type === 'residential_property' ? colors.green50 : colors.cerulean50,
            color: entity.type === 'residential_property' ? colors.green600 : colors.cerulean600,
          }}
        >
          {entity.type === 'residential_property' ? <Home aria-hidden="true" sx={{ fontSize: 16 }} /> : <Business aria-hidden="true" sx={{ fontSize: 16 }} />}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: colors.gray900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {entity.name}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: colors.gray500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {propertyType}
            {entity.isPrimary && ' · Primary'}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

// ============================================================================
// MORE PROPERTIES CARD
// ============================================================================

interface MorePropertiesCardProps {
  count: number;
}

const MorePropertiesCard: React.FC<MorePropertiesCardProps> = ({ count }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate('/unified-portal/properties');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/unified-portal/properties');
    }
  };

  return (
    <Card
      elevation={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${count} more properties`}
      sx={{
        p: 1.5,
        minWidth: 100,
        borderRadius: '8px',
        border: `1px dashed ${colors.gray300}`,
        bgcolor: colors.gray50,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        '&:hover': { bgcolor: colors.blurple50, borderColor: colors.blurple300 },
        '&:focus': {
          outline: `2px solid ${colors.blurple500}`,
          outlineOffset: 2,
        },
      }}
    >
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.blurple500 }}>
        +{count} more
      </Typography>
    </Card>
  );
};

// ============================================================================
// MAIN CONTENT
// ============================================================================

const CommandCenterContent: React.FC = () => {
  const navigate = useNavigate();
  const { activePersona, userProfile } = usePersona();

  // Get persona-specific data
  const tasks = useMemo(() => getPriorityTasks(activePersona.id, 3), [activePersona.id]);
  const greeting = useMemo(() => getGreetingMessage(userProfile.name.split(' ')[0], tasks), [userProfile.name, tasks]);
  const quickActions = useMemo(() => getQuickActionsForPersona(activePersona.id).slice(0, 6), [activePersona.id]);
  const services = useMemo(() => getServicesForPersona(activePersona.id, 4), [activePersona.id]);

  const urgentCount = tasks.filter(t => t.urgency === 'overdue' || t.urgency === 'urgent').length;

  // Calculate property stats from linked entities
  const propertyStats = useMemo(() => {
    const entities = userProfile.linkedEntities || [];
    const residentialProps = entities.filter(e => e.type === 'residential_property');
    const businesses = entities.filter(e => e.type === 'business');
    const totalProperties = residentialProps.length + businesses.length;

    return {
      total: totalProperties,
      residential: residentialProps.length,
      business: businesses.length,
      entities: entities,
      hasMultiple: totalProperties > 1,
    };
  }, [userProfile.linkedEntities]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="dashboard" />

      <Box
        component="main"
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        {/* GREETING */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, color: colors.gray900, mb: 0.5 }}>
            {greeting.headline}
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: colors.gray600 }}>
            {greeting.subline}
          </Typography>

          {/* Dev badge */}
          <Chip
            size="small"
            label={`Persona: ${activePersona.name}`}
            sx={{ mt: 1, height: 22, fontSize: '0.6875rem', bgcolor: colors.blurple100, color: colors.blurple700 }}
          />
        </Box>

        {/* PROPERTY OVERVIEW - Show if user has properties */}
        {propertyStats.total > 0 && (
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              mb: 4,
              borderRadius: '12px',
              border: `1px solid ${colors.gray200}`,
              bgcolor: colors.white,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: colors.cerulean50, color: colors.cerulean600 }}>
                  <Apartment aria-hidden="true" sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: colors.gray900 }}>
                    Your Properties
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>
                    {propertyStats.total} {propertyStats.total === 1 ? 'property' : 'properties'} connected
                    {propertyStats.residential > 0 && propertyStats.business > 0 &&
                      ` · ${propertyStats.residential} residential, ${propertyStats.business} business`
                    }
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/unified-portal/properties')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  borderRadius: '8px',
                  borderColor: colors.gray300,
                  color: colors.gray700,
                  '&:hover': { borderColor: colors.blurple500, color: colors.blurple600 },
                }}
              >
                Manage
              </Button>
            </Box>

            {/* Property Cards */}
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 0.5 }}>
              {propertyStats.entities.slice(0, 4).map((entity) => (
                <PropertyCard key={entity.id} entity={entity} />
              ))}
              {propertyStats.total > 4 && (
                <MorePropertiesCard count={propertyStats.total - 4} />
              )}
            </Box>
          </Card>
        )}

        {/* PRIORITY TASKS */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.125rem', color: colors.gray900 }}>
              {urgentCount > 0 ? 'Needs Your Attention' : 'Your Overview'}
            </Typography>
            {urgentCount > 0 && (
              <Chip
                icon={<Warning aria-hidden="true" sx={{ fontSize: 14 }} />}
                label={`${urgentCount} urgent`}
                size="small"
                sx={{ bgcolor: colors.yellow100, color: colors.yellow700, fontWeight: 600, '& .MuiChip-icon': { color: colors.yellow600 } }}
              />
            )}
          </Box>

          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                <TaskCard task={task} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* QUICK ACTIONS */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.125rem', color: colors.gray900, mb: 2 }}>
            Quick Actions
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              pb: 1,
              mx: { xs: -2, sm: 0 },
              px: { xs: 2, sm: 0 },
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: colors.gray300, borderRadius: 2 },
            }}
          >
            {quickActions.map((action) => (
              <QuickActionButton key={action.id} action={action} />
            ))}
          </Box>
        </Box>

        {/* SERVICES */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1.125rem', color: colors.gray900 }}>
              Your Services
            </Typography>
            <Button
              endIcon={<ArrowForward aria-hidden="true" sx={{ fontSize: 16 }} />}
              onClick={() => navigate('/unified-portal/sitemap')}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', color: colors.blurple500 }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={2}>
            {services.map((service) => (
              <Grid size={{ xs: 12, sm: 6 }} key={service.id}>
                <ServiceCard service={service} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* NOTIFICATIONS & HELP */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ p: 3, borderRadius: '12px', border: `1px solid ${colors.gray200}`, bgcolor: colors.white }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NotificationsNone aria-hidden="true" sx={{ color: colors.gray600 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: colors.gray900 }}>
                  Notifications
                </Typography>
                <Chip label="2 new" size="small" sx={{ height: 20, fontSize: '0.625rem', bgcolor: colors.blurple100, color: colors.blurple600, ml: 'auto' }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: colors.blurple50, borderRadius: '8px' }}>
                  <Info aria-hidden="true" sx={{ fontSize: 18, color: colors.blurple500, mt: 0.25 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.gray900 }}>Rate change notice</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray600 }}>Water rates updated effective Jan 1, 2025</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, borderRadius: '8px' }}>
                  <CheckCircle aria-hidden="true" sx={{ fontSize: 18, color: colors.green500, mt: 0.25 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.gray900 }}>Payment received</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray600 }}>$89.50 for water service · Dec 1</Typography>
                  </Box>
                </Box>
              </Box>

              <Button fullWidth variant="text" onClick={() => navigate('/unified-portal/history')} sx={{ mt: 2, textTransform: 'none', fontWeight: 600, color: colors.blurple500 }}>
                View All Notifications
              </Button>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ p: 3, borderRadius: '12px', border: `1px solid ${colors.gray200}`, background: `linear-gradient(135deg, ${colors.blurple50} 0%, ${colors.white} 100%)` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SupportAgent aria-hidden="true" sx={{ color: colors.blurple500 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: colors.gray900 }}>Need Help?</Typography>
              </Box>

              <Typography sx={{ fontSize: '0.875rem', color: colors.gray600, mb: 2 }}>
                Our support team is here to help with any questions about your account, bills, or city services.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button variant="contained" onClick={() => navigate('/unified-portal/support')} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', bgcolor: colors.blurple500, '&:hover': { bgcolor: colors.blurple600 } }}>
                  Contact Support
                </Button>
                <Button variant="outlined" onClick={() => navigate('/unified-portal/support')} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', borderColor: colors.blurple200, color: colors.blurple600 }}>
                  View FAQs
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${colors.gray200}`, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
            © 2024 Cloud City · Powered by OpenGov
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// ============================================================================
// EXPORT WITH PROVIDER
// ============================================================================

const CommandCenter: React.FC = () => (
  <PersonaProvider>
    <CommandCenterContent />
  </PersonaProvider>
);

export default CommandCenter;
