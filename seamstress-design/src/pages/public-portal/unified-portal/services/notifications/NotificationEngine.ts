/**
 * Notification Engine
 * 
 * Multi-channel notification system supporting:
 * - Email notifications
 * - SMS text messages
 * - Push notifications
 * - In-app notifications
 * 
 * Features:
 * - Template-based messaging
 * - Variable substitution
 * - Scheduling and queuing
 * - Delivery tracking
 * - User preferences
 * - Multi-language support
 */

import type { Notification, NotificationChannel, NotificationStatus } from '../../types';

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface NotificationTemplate {
  id: string;
  code: string;
  name: string;
  description: string;
  channels: NotificationChannel[];
  category: 'billing' | 'permit' | 'license' | 'tax' | 'grant' | 'account' | 'system';
  subject: string;
  emailBody: string;
  smsBody: string;
  pushTitle: string;
  pushBody: string;
  variables: string[];
  isActive: boolean;
}

export interface NotificationRequest {
  templateCode: string;
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channels: NotificationChannel[];
  variables: Record<string, string | number | boolean | Date>;
  scheduledFor?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  channelResults: {
    channel: NotificationChannel;
    success: boolean;
    messageId?: string;
    error?: string;
  }[];
}

export interface UserNotificationPreferences {
  userId: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  categories: {
    billing: NotificationChannel[];
    permit: NotificationChannel[];
    license: NotificationChannel[];
    tax: NotificationChannel[];
    grant: NotificationChannel[];
    account: NotificationChannel[];
    system: NotificationChannel[];
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
    timezone: string;
  };
  language: string;
}

// ============================================
// NOTIFICATION TEMPLATES
// ============================================

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  // Billing Notifications
  {
    id: '1',
    code: 'bill_due_reminder',
    name: 'Bill Due Reminder',
    description: 'Reminder sent before a bill is due',
    channels: ['email', 'sms', 'push'],
    category: 'billing',
    subject: 'Reminder: ${billType} payment due on ${dueDate}',
    emailBody: `
Dear ${recipientName},

This is a friendly reminder that your ${billType} payment of $${amount} is due on ${dueDate}.

Bill Details:
- Bill Number: ${billNumber}
- Amount Due: $${amount}
- Due Date: ${dueDate}

To make a payment, please visit: ${paymentLink}

Thank you,
${cityName} Government Services
    `.trim(),
    smsBody: 'Reminder: Your ${billType} payment of $${amount} is due ${dueDate}. Pay now: ${paymentLink}',
    pushTitle: 'Payment Due Soon',
    pushBody: '${billType} payment of $${amount} due ${dueDate}',
    variables: ['recipientName', 'billType', 'amount', 'dueDate', 'billNumber', 'paymentLink', 'cityName'],
    isActive: true,
  },
  {
    id: '2',
    code: 'bill_overdue',
    name: 'Bill Overdue Notice',
    description: 'Notice sent when a bill becomes overdue',
    channels: ['email', 'sms'],
    category: 'billing',
    subject: 'URGENT: ${billType} payment is overdue',
    emailBody: `
Dear ${recipientName},

Your ${billType} payment of $${amount} was due on ${dueDate} and is now ${daysOverdue} days overdue.

Late fees may apply. Please make your payment as soon as possible to avoid additional penalties.

To make a payment, please visit: ${paymentLink}

If you are experiencing financial hardship, please contact us to discuss payment plan options.

${cityName} Government Services
    `.trim(),
    smsBody: 'URGENT: Your ${billType} payment of $${amount} is ${daysOverdue} days overdue. Pay now to avoid penalties: ${paymentLink}',
    pushTitle: 'Payment Overdue',
    pushBody: '${billType} payment is ${daysOverdue} days overdue. Pay now to avoid penalties.',
    variables: ['recipientName', 'billType', 'amount', 'dueDate', 'daysOverdue', 'paymentLink', 'cityName'],
    isActive: true,
  },
  {
    id: '3',
    code: 'payment_received',
    name: 'Payment Confirmation',
    description: 'Confirmation sent when payment is received',
    channels: ['email', 'push'],
    category: 'billing',
    subject: 'Payment Received - Confirmation #${confirmationNumber}',
    emailBody: `
Dear ${recipientName},

Thank you for your payment. This email confirms that we have received your payment.

Payment Details:
- Confirmation Number: ${confirmationNumber}
- Amount Paid: $${amount}
- Payment Date: ${paymentDate}
- Payment Method: ${paymentMethod}
- Bill(s) Paid: ${billNumbers}

You can view your payment history at: ${accountLink}

Thank you,
${cityName} Government Services
    `.trim(),
    smsBody: 'Payment of $${amount} received. Confirmation #${confirmationNumber}',
    pushTitle: 'Payment Received',
    pushBody: 'Payment of $${amount} confirmed. Ref: ${confirmationNumber}',
    variables: ['recipientName', 'confirmationNumber', 'amount', 'paymentDate', 'paymentMethod', 'billNumbers', 'accountLink', 'cityName'],
    isActive: true,
  },

  // Permit Notifications
  {
    id: '4',
    code: 'application_submitted',
    name: 'Application Submitted',
    description: 'Confirmation when an application is submitted',
    channels: ['email', 'push'],
    category: 'permit',
    subject: 'Application Received - ${applicationNumber}',
    emailBody: `
Dear ${recipientName},

Thank you for submitting your ${applicationType} application. We have received your application and it is now in our queue for review.

Application Details:
- Application Number: ${applicationNumber}
- Application Type: ${applicationType}
- Submitted: ${submittedDate}
- Estimated Review Time: ${estimatedDays} business days

You can track the status of your application at: ${trackingLink}

What's Next:
1. Initial review of your application
2. You may be contacted if additional information is needed
3. Once approved, you will receive payment instructions

Thank you,
${cityName} Permitting Department
    `.trim(),
    smsBody: '${applicationType} application ${applicationNumber} received. Track status: ${trackingLink}',
    pushTitle: 'Application Submitted',
    pushBody: 'Your ${applicationType} application has been received.',
    variables: ['recipientName', 'applicationType', 'applicationNumber', 'submittedDate', 'estimatedDays', 'trackingLink', 'cityName'],
    isActive: true,
  },
  {
    id: '5',
    code: 'application_approved',
    name: 'Application Approved',
    description: 'Notification when application is approved',
    channels: ['email', 'sms', 'push'],
    category: 'permit',
    subject: 'APPROVED: ${applicationType} - ${applicationNumber}',
    emailBody: `
Dear ${recipientName},

Congratulations! Your ${applicationType} application has been approved.

Application Details:
- Application Number: ${applicationNumber}
- Application Type: ${applicationType}
- Approval Date: ${approvalDate}
- Valid Until: ${expiryDate}

${conditions ? 'Conditions of Approval:\\n' + conditions : ''}

You can download your approved permit at: ${downloadLink}

Important: Please ensure all work is completed in accordance with the approved plans and applicable codes.

Thank you,
${cityName} Permitting Department
    `.trim(),
    smsBody: 'APPROVED: Your ${applicationType} ${applicationNumber} has been approved. Download: ${downloadLink}',
    pushTitle: 'Application Approved!',
    pushBody: 'Your ${applicationType} has been approved.',
    variables: ['recipientName', 'applicationType', 'applicationNumber', 'approvalDate', 'expiryDate', 'conditions', 'downloadLink', 'cityName'],
    isActive: true,
  },
  {
    id: '6',
    code: 'info_requested',
    name: 'Information Requested',
    description: 'Notification when additional information is needed',
    channels: ['email', 'sms', 'push'],
    category: 'permit',
    subject: 'ACTION REQUIRED: Additional information needed for ${applicationNumber}',
    emailBody: `
Dear ${recipientName},

We are reviewing your ${applicationType} application and need additional information to proceed.

Application: ${applicationNumber}

Information Needed:
${requestedItems}

Please provide this information within ${deadlineDays} days to avoid delays in processing your application.

Submit your response at: ${responseLink}

If you have questions, please contact us at ${contactEmail} or ${contactPhone}.

Thank you,
${cityName} Permitting Department
    `.trim(),
    smsBody: 'ACTION NEEDED: Info required for application ${applicationNumber}. Respond by ${deadlineDate}: ${responseLink}',
    pushTitle: 'Information Needed',
    pushBody: 'Additional info required for your application. Please respond.',
    variables: ['recipientName', 'applicationType', 'applicationNumber', 'requestedItems', 'deadlineDays', 'deadlineDate', 'responseLink', 'contactEmail', 'contactPhone', 'cityName'],
    isActive: true,
  },
  {
    id: '7',
    code: 'inspection_scheduled',
    name: 'Inspection Scheduled',
    description: 'Notification when inspection is scheduled',
    channels: ['email', 'sms', 'push'],
    category: 'permit',
    subject: 'Inspection Scheduled - ${applicationNumber}',
    emailBody: `
Dear ${recipientName},

An inspection has been scheduled for your ${applicationType}.

Inspection Details:
- Application: ${applicationNumber}
- Inspection Type: ${inspectionType}
- Date: ${inspectionDate}
- Time: ${inspectionTime}
- Address: ${address}
- Inspector: ${inspectorName}

Please ensure:
- Access to the work area is available
- All relevant work is complete and visible
- Someone 18+ is present at the property

To reschedule, visit: ${rescheduleLink}

Thank you,
${cityName} Inspections Department
    `.trim(),
    smsBody: 'Inspection scheduled: ${inspectionDate} at ${inspectionTime} for ${applicationNumber}. Reschedule: ${rescheduleLink}',
    pushTitle: 'Inspection Scheduled',
    pushBody: '${inspectionType} inspection on ${inspectionDate} at ${inspectionTime}',
    variables: ['recipientName', 'applicationType', 'applicationNumber', 'inspectionType', 'inspectionDate', 'inspectionTime', 'address', 'inspectorName', 'rescheduleLink', 'cityName'],
    isActive: true,
  },

  // License Notifications
  {
    id: '8',
    code: 'license_expiring',
    name: 'License Expiring Soon',
    description: 'Reminder before license expires',
    channels: ['email', 'sms', 'push'],
    category: 'license',
    subject: 'Reminder: Your ${licenseType} expires on ${expiryDate}',
    emailBody: `
Dear ${recipientName},

Your ${licenseType} (${licenseNumber}) will expire on ${expiryDate}.

To continue operating without interruption, please renew your license before the expiration date.

Renewal Fee: $${renewalFee}
Renew Online: ${renewalLink}

Late renewals may be subject to additional fees and may result in license suspension.

Thank you,
${cityName} Licensing Department
    `.trim(),
    smsBody: 'Your ${licenseType} expires ${expiryDate}. Renew now: ${renewalLink}',
    pushTitle: 'License Expiring Soon',
    pushBody: '${licenseType} expires ${expiryDate}. Renew to avoid interruption.',
    variables: ['recipientName', 'licenseType', 'licenseNumber', 'expiryDate', 'renewalFee', 'renewalLink', 'cityName'],
    isActive: true,
  },
  {
    id: '9',
    code: 'license_renewed',
    name: 'License Renewed',
    description: 'Confirmation of license renewal',
    channels: ['email', 'push'],
    category: 'license',
    subject: 'License Renewed - ${licenseNumber}',
    emailBody: `
Dear ${recipientName},

Your ${licenseType} has been successfully renewed.

License Details:
- License Number: ${licenseNumber}
- License Type: ${licenseType}
- New Expiry Date: ${newExpiryDate}

Download your updated license: ${downloadLink}

Thank you for your continued compliance.

${cityName} Licensing Department
    `.trim(),
    smsBody: '${licenseType} renewed. New expiry: ${newExpiryDate}',
    pushTitle: 'License Renewed',
    pushBody: '${licenseType} successfully renewed until ${newExpiryDate}',
    variables: ['recipientName', 'licenseType', 'licenseNumber', 'newExpiryDate', 'downloadLink', 'cityName'],
    isActive: true,
  },

  // Tax Notifications
  {
    id: '10',
    code: 'tax_bill_available',
    name: 'Tax Bill Available',
    description: 'Notification when new tax bill is available',
    channels: ['email', 'push'],
    category: 'tax',
    subject: '${taxYear} ${taxType} Tax Bill Available',
    emailBody: `
Dear ${recipientName},

Your ${taxYear} ${taxType} tax bill is now available.

Property: ${propertyAddress}
Parcel: ${parcelNumber}
Total Amount Due: $${totalAmount}

Payment Schedule:
${paymentSchedule}

View and pay your bill online: ${billLink}

Payment options include credit/debit card, bank transfer, or payment plan.

${cityName} Tax Department
    `.trim(),
    smsBody: 'Your ${taxYear} ${taxType} tax bill ($${totalAmount}) is ready. View: ${billLink}',
    pushTitle: 'Tax Bill Available',
    pushBody: '${taxYear} ${taxType} tax bill of $${totalAmount} is ready.',
    variables: ['recipientName', 'taxYear', 'taxType', 'propertyAddress', 'parcelNumber', 'totalAmount', 'paymentSchedule', 'billLink', 'cityName'],
    isActive: true,
  },

  // Document Notifications
  {
    id: '11',
    code: 'document_expiring',
    name: 'Document Expiring',
    description: 'Reminder when uploaded document is expiring',
    channels: ['email', 'push'],
    category: 'account',
    subject: 'Document Expiring: ${documentName}',
    emailBody: `
Dear ${recipientName},

The following document in your account is expiring soon:

Document: ${documentName}
Type: ${documentType}
Expiry Date: ${expiryDate}

Please upload an updated document to ensure your records remain current.

Upload new document: ${uploadLink}

${cityName} Government Services
    `.trim(),
    smsBody: '${documentName} expires ${expiryDate}. Upload replacement: ${uploadLink}',
    pushTitle: 'Document Expiring',
    pushBody: '${documentName} expires ${expiryDate}. Update required.',
    variables: ['recipientName', 'documentName', 'documentType', 'expiryDate', 'uploadLink', 'cityName'],
    isActive: true,
  },

  // Account Notifications
  {
    id: '12',
    code: 'account_welcome',
    name: 'Welcome Email',
    description: 'Welcome email for new accounts',
    channels: ['email'],
    category: 'account',
    subject: 'Welcome to ${cityName} Government Portal',
    emailBody: `
Dear ${recipientName},

Welcome to the ${cityName} Government Portal! Your account has been created successfully.

With your new account, you can:
- Pay bills and taxes online
- Apply for permits and licenses
- Track application status
- Store important documents
- Receive notifications and reminders

Get Started: ${portalLink}

If you have any questions, visit our Help Center: ${helpLink}

Thank you,
${cityName} Government Services
    `.trim(),
    smsBody: 'Welcome to ${cityName} Gov Portal! Get started: ${portalLink}',
    pushTitle: 'Welcome!',
    pushBody: 'Your ${cityName} Government Portal account is ready.',
    variables: ['recipientName', 'cityName', 'portalLink', 'helpLink'],
    isActive: true,
  },
];

// ============================================
// NOTIFICATION ENGINE CLASS
// ============================================

export class NotificationEngine {
  private templates: Map<string, NotificationTemplate> = new Map();
  private defaultPreferences: UserNotificationPreferences;

  constructor() {
    // Load templates
    NOTIFICATION_TEMPLATES.forEach(template => {
      this.templates.set(template.code, template);
    });

    // Default preferences
    this.defaultPreferences = {
      userId: '',
      channels: {
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
      categories: {
        billing: ['email', 'push', 'inApp'],
        permit: ['email', 'push', 'inApp'],
        license: ['email', 'push', 'inApp'],
        tax: ['email', 'push', 'inApp'],
        grant: ['email', 'push', 'inApp'],
        account: ['email', 'inApp'],
        system: ['email', 'inApp'],
      },
      language: 'en',
    };
  }

  getTemplate(code: string): NotificationTemplate | undefined {
    return this.templates.get(code);
  }

  getAllTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: NotificationTemplate['category']): NotificationTemplate[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  interpolateTemplate(template: string, variables: Record<string, string | number | boolean | Date>): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
      const stringValue = value instanceof Date ? value.toLocaleDateString() : String(value);
      result = result.replace(regex, stringValue);
    });
    return result;
  }

  async send(request: NotificationRequest): Promise<NotificationResult> {
    const template = this.getTemplate(request.templateCode);
    if (!template) {
      return {
        success: false,
        channelResults: [{
          channel: 'inApp',
          success: false,
          error: `Template not found: ${request.templateCode}`,
        }],
      };
    }

    const channelResults: NotificationResult['channelResults'] = [];

    for (const channel of request.channels) {
      if (!template.channels.includes(channel)) {
        channelResults.push({
          channel,
          success: false,
          error: `Channel ${channel} not supported for this template`,
        });
        continue;
      }

      try {
        // In a real implementation, this would call the appropriate service
        // (SendGrid for email, Twilio for SMS, Firebase for push, etc.)
        const messageId = await this.sendToChannel(channel, template, request);
        channelResults.push({
          channel,
          success: true,
          messageId,
        });
      } catch (error) {
        channelResults.push({
          channel,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      success: channelResults.some(r => r.success),
      notificationId: `notif_${Date.now()}`,
      channelResults,
    };
  }

  private async sendToChannel(
    channel: NotificationChannel,
    template: NotificationTemplate,
    request: NotificationRequest
  ): Promise<string> {
    switch (channel) {
      case 'email':
        return this.sendEmail(template, request);
      case 'sms':
        return this.sendSMS(template, request);
      case 'push':
        return this.sendPush(template, request);
      case 'inApp':
        return this.createInAppNotification(template, request);
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }

  private async sendEmail(template: NotificationTemplate, request: NotificationRequest): Promise<string> {
    const subject = this.interpolateTemplate(template.subject, request.variables);
    const body = this.interpolateTemplate(template.emailBody, request.variables);
    
    // In production: Send via SendGrid, AWS SES, etc.
    console.log('Sending email:', { to: request.recipientEmail, subject, body });
    
    return `email_${Date.now()}`;
  }

  private async sendSMS(template: NotificationTemplate, request: NotificationRequest): Promise<string> {
    const body = this.interpolateTemplate(template.smsBody, request.variables);
    
    // In production: Send via Twilio, AWS SNS, etc.
    console.log('Sending SMS:', { to: request.recipientPhone, body });
    
    return `sms_${Date.now()}`;
  }

  private async sendPush(template: NotificationTemplate, request: NotificationRequest): Promise<string> {
    const title = this.interpolateTemplate(template.pushTitle, request.variables);
    const body = this.interpolateTemplate(template.pushBody, request.variables);
    
    // In production: Send via Firebase Cloud Messaging, AWS SNS, etc.
    console.log('Sending push:', { to: request.recipientId, title, body });
    
    return `push_${Date.now()}`;
  }

  private async createInAppNotification(template: NotificationTemplate, request: NotificationRequest): Promise<string> {
    const title = this.interpolateTemplate(template.pushTitle, request.variables);
    const body = this.interpolateTemplate(template.pushBody, request.variables);
    
    // In production: Store in database
    console.log('Creating in-app notification:', { userId: request.recipientId, title, body });
    
    return `inapp_${Date.now()}`;
  }

  // Scheduled notification helpers
  async scheduleReminder(
    templateCode: string,
    recipientId: string,
    scheduledFor: Date,
    variables: Record<string, string | number | boolean | Date>
  ): Promise<string> {
    // In production: Use a job scheduler like Bull, Agenda, or AWS EventBridge
    console.log('Scheduling notification:', { templateCode, recipientId, scheduledFor, variables });
    return `scheduled_${Date.now()}`;
  }

  async cancelScheduledNotification(scheduleId: string): Promise<boolean> {
    console.log('Cancelling scheduled notification:', scheduleId);
    return true;
  }
}

// Export singleton
export const notificationEngine = new NotificationEngine();

export default notificationEngine;

