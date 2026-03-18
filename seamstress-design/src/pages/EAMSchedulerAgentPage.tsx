import React, { useState } from 'react';
import { Box, Container, Typography, Stepper, Step, StepLabel, Button, Stack, Paper } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { GenerativeResponse } from '../components/GenerativeUI';
import {
  UnscheduledTasksTable,
  WorkerAvailability,
  ScheduleProposal,
  PublishResult
} from '../components/EAMScheduler';
import {
  mockEAMTasks,
  mockEAMCrews,
  mockEAMEquipment,
  mockScheduleDraft,
  mockPublishResult
} from '../data/mockEAMData';
import type { EAMAgentResponse, EAMTask, TaskPriority } from '../types/opengov/eam';

const EAMSchedulerAgentPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tasks, setTasks] = useState(mockEAMTasks);
  const [crews] = useState(mockEAMCrews);
  const [schedule] = useState(mockScheduleDraft);
  const [publishResult] = useState(mockPublishResult);
  const [responses, setResponses] = useState<EAMAgentResponse[]>([]);

  const steps = [
    'Select Tasks',
    'Review Workers',
    'Review Schedule',
    'Publish',
    'Complete'
  ];

  const simulateAgentResponse = (stepIndex: number) => {
    const responseMap: Record<EAMAgentResponse['step'], Partial<EAMAgentResponse>> = {
      tasks: {
        title: 'Analyzing Unscheduled Maintenance Tasks',
        body: 'I\'ve identified 10 unscheduled maintenance tasks that need to be assigned to crews. These tasks range from urgent traffic signal repairs to routine park maintenance. Please review and prioritize the tasks you\'d like to schedule for this week.',
        toolCalls: ['fetch_unscheduled_tasks', 'analyze_severity', 'calculate_priority_scores']
      },
      workers: {
        title: 'Evaluating Crew Availability and Capacity',
        body: 'I\'ve analyzed the current crew capacity and availability. Most teams have moderate utilization levels, with the Bridge & Structure Team at 90% capacity. You can exclude crews that shouldn\'t receive new assignments.',
        toolCalls: ['get_crew_capacity', 'analyze_skills_match', 'check_equipment_availability']
      },
      schedule: {
        title: 'Generating Optimized Schedule Proposal',
        body: 'I\'ve created a draft schedule that balances crew workload, respects capacity constraints, and prioritizes urgent tasks. There are 3 conflicts that need your attention - I\'ve provided fix options for each.',
        toolCalls: ['optimize_schedule', 'detect_conflicts', 'generate_fix_options', 'validate_constraints']
      },
      publish: {
        title: 'Publishing Schedule and Notifying Teams',
        body: 'The schedule has been successfully published! All crews have been notified, work orders have been created, and the resident notice is ready for distribution. The schedule is now active in the system.',
        toolCalls: ['publish_schedule', 'create_work_orders', 'send_notifications', 'generate_resident_notice']
      },
      complete: {
        title: 'Schedule Successfully Implemented',
        body: 'Great job! The weekly maintenance schedule has been successfully created and deployed. All 10 work orders have been assigned, crews have been notified, and tracking is now active.',
        toolCalls: ['finalize_schedule', 'update_dashboard']
      }
    };

    const stepKey = ['tasks', 'workers', 'schedule', 'publish', 'complete'][stepIndex] as EAMAgentResponse['step'];
    const responseData = responseMap[stepKey];

    if (!responseData) {
      return;
    }

    const newResponse: EAMAgentResponse = {
      id: `response-${Date.now()}`,
      timestamp: new Date().toISOString(),
      step: stepKey,
      title: responseData.title || '',
      body: responseData.body || '',
      toolCalls: responseData.toolCalls || [],
      content: null
    };

    setResponses(prev => [...prev, newResponse]);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      simulateAgentResponse(nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleScheduleTasks = (selectedTasks: string[]) => {
    handleNextStep();
  };

  const handlePriorityChange = (taskId: string, priority: TaskPriority) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, priority } : task
    ));
  };

  const handleAcceptSchedule = () => {
    handleNextStep();
  };

  const handlePublish = () => {
    handleNextStep();
  };

  React.useEffect(() => {
    simulateAgentResponse(0);
  }, []);

  const renderStepContent = () => {
    const currentResponse = responses[currentStep];
    if (!currentResponse) return null;

    let content = null;

    switch (currentStep) {
      case 0:
        content = (
          <UnscheduledTasksTable
            tasks={tasks}
            onScheduleTasks={handleScheduleTasks}
            onPriorityChange={handlePriorityChange}
          />
        );
        break;
      case 1:
        content = (
          <WorkerAvailability
            crews={crews}
            onExclusionChange={(crewId, excluded) => {}}
          />
        );
        break;
      case 2:
        content = (
          <ScheduleProposal
            schedule={schedule}
            tasks={tasks}
            crews={crews}
            onAcceptSchedule={handleAcceptSchedule}
            onRejectSchedule={() => {}}
            onReschedule={() => {}}
          />
        );
        break;
      case 3:
        content = (
          <PublishResult
            result={publishResult}
            onViewWorkOrders={() => {}}
            onExportResidentNotice={() => {}}
          />
        );
        break;
      case 4:
        content = (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Schedule Implementation Complete
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              All maintenance tasks have been successfully scheduled and assigned.
              The system is now tracking progress and crews have begun their work.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setCurrentStep(0);
                setResponses([]);
                simulateAgentResponse(0);
              }}
            >
              Start New Schedule
            </Button>
          </Paper>
        );
        break;
    }

    return (
      <GenerativeResponse
        response={currentResponse}
        onFeedback={(id, type, comment) => {}}
        onAccept={(id) => {}}
        onReject={(id, reason) => {}}
        showFeedback={currentStep !== 4}
      >
        {content}
      </GenerativeResponse>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 4 }}>
      <PageHeaderComposable
        title="EAM Work Scheduler Agent"
        description="AI-powered maintenance task scheduling and crew assignment"
        actions={
          <Button variant="outlined">
            View Documentation
          </Button>
        }
      />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          {currentStep < 4 && currentStep > 0 && (
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={currentStep === 3 ? handlePublish : handleNextStep}
                disabled={currentStep === steps.length - 1}
              >
                {currentStep === 3 ? 'Publish Schedule' : 'Continue'}
              </Button>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default EAMSchedulerAgentPage;