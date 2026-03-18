/**
 * Support Page
 * Help & Support center with FAQs, contact options, and knowledge base
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Description,
  Payment,
  Person,
  Email,
  Phone,
  Chat,
  Shield,
  ArrowBack,
  Construction,
  Receipt,
  Park,
  CardGiftcard,
  Gavel,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = capitalDesignTokens.foundations.colors;

// FAQ Categories
type FaqCategory = 'main' | 'billing' | 'payment' | 'account';

interface FaqItem {
  question: string;
  answer: string;
}

const billingFaqs: FaqItem[] = [
  {
    question: 'How is my bill calculated?',
    answer: 'Your bill is calculated based on your usage multiplied by the current rate, plus any applicable fees and taxes.',
  },
  {
    question: 'When is my bill due?',
    answer: 'Bills are typically due 21 days after the billing date. The exact due date is printed on your bill and visible in your online account.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit cards (Visa, Mastercard, Discover, American Express), debit cards, ACH bank transfers, and in-person cash or check payments at City Hall.',
  },
  {
    question: 'How do I dispute a charge?',
    answer: 'To dispute a charge, contact our support team with your account number and details about the charge in question. We will review your account and respond within 3-5 business days.',
  },
  {
    question: 'Can I set up automatic payments?',
    answer: 'Yes! You can set up AutoPay in your Account Settings under Billing Preferences. AutoPay will automatically charge your selected payment method before each due date.',
  },
];

const paymentFaqs: FaqItem[] = [
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit and debit cards. Some entities may allow eChecks or ACH transfers. Specific options will be listed at checkout.',
  },
  {
    question: 'How long does it take for a payment to process?',
    answer: 'Credit and debit card payments are typically processed within 1-2 business days. ACH transfers may take 3-5 business days to fully clear.',
  },
  {
    question: 'How to start a new service?',
    answer: 'New service setup must be initiated through your local government office. You may be asked to provide proof of residency and valid ID. Call 1-800-123-4567 to begin the process.',
  },
  {
    question: 'How to recover a locked or disabled account?',
    answer: 'If your portal account is locked, disabled or suspended, reach out to your local government office at support@cloudcity.com to reset access.',
  },
  {
    question: 'How to change your email or login credentials?',
    answer: 'You can update your email and log in credentials under the account management page in the portal. Updating an email address will require you to complete the verification process.',
  },
];

const accountFaqs: FaqItem[] = [
  {
    question: 'How to request a change to your information?',
    answer: 'To update your account details (such as name, phone number, or address), please contact your local government office at 1-800-123-4567 or support@cloudcity.com. They will verify your identity and process your request. Additional documentation may be required.',
  },
  {
    question: 'How to request account closure or disconnection of service?',
    answer: 'To request service disconnection, contact your local office directly. They may require identity verification and a final meter read or account reconciliation before closing.',
  },
  {
    question: 'How to start a new service?',
    answer: 'New service setup must be initiated through your local government office. You may be asked to provide proof of residency and valid ID. Call 1-800-123-4567 to begin the process.',
  },
  {
    question: 'How to recover a locked or disabled account?',
    answer: 'If your portal account is locked, disabled or suspended, reach out to your local government office at support@cloudcity.com to reset access.',
  },
  {
    question: 'How to change your email or login credentials?',
    answer: 'You can update your email and log in credentials under the account management page in the portal. Updating an email address will require you to complete the verification process.',
  },
];

const mainFaqs: FaqItem[] = [
  {
    question: 'How do I set up a payment in the portal?',
    answer: 'Log in and select a bill to be paid. The portal will navigate you to the payment page where you can follow the steps to enter your payment info. Confirmation will be emailed after submission.',
  },
  {
    question: 'How can I view my past bills?',
    answer: 'Navigate to the History section from the main menu. You can view all past bills, payments, and account activity. You can also download statements and receipts.',
  },
  {
    question: 'How do I set up or manage autopay?',
    answer: 'Go to Account > Billing Preferences to set up or manage AutoPay. You can enable AutoPay for individual services and select your preferred payment method.',
  },
  {
    question: 'How do I set billing notification preferences?',
    answer: 'Go to Account > Profile Information to manage your notification preferences. You can choose to receive email or SMS notifications for bill reminders, payment confirmations, and service updates.',
  },
];

const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as FaqCategory | null;
  const [activeCategory, setActiveCategory] = useState<FaqCategory>(categoryParam || 'main');
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const handleCategoryClick = (category: FaqCategory) => {
    setActiveCategory(category);
    setExpandedFaq(false);
  };

  const handleFaqChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const getCurrentFaqs = () => {
    switch (activeCategory) {
      case 'billing': return billingFaqs;
      case 'payment': return paymentFaqs;
      case 'account': return accountFaqs;
      default: return mainFaqs;
    }
  };

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'billing': return 'Billing FAQ';
      case 'payment': return 'Payment FAQ';
      case 'account': return 'Account Management FAQ';
      default: return 'Help & Support';
    }
  };

  // Support sidebar component
  const SupportSidebar = () => (
    <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, bgcolor: colors.gray50 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
          Support Available
        </Typography>
        <Typography variant="body2" sx={{ color: colors.gray500, mb: 3 }}>
          Having trouble? Our support team is here to help
        </Typography>

        <Button
          fullWidth
          variant="text"
          startIcon={<Chat sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: colors.blurple500,
            justifyContent: 'flex-start',
            py: 1,
            '&:hover': { bgcolor: colors.blurple50 },
          }}
        >
          Start Live Chat
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="support" />

      <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: 4, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, pb: 3, borderBottom: `1px solid ${colors.gray200}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              {activeCategory !== 'main' && (
                <Button
                  startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
                  onClick={() => setActiveCategory('main')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    color: colors.gray600,
                    mb: 1,
                    ml: -1,
                    '&:hover': { bgcolor: 'transparent', color: colors.blurple500 },
                  }}
                >
                  Back to Help & Support
                </Button>
              )}
              <Typography variant="h1" sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900, mb: 0.5 }}>
                {getCategoryTitle()}
              </Typography>
              <Typography variant="body1" sx={{ color: colors.gray500 }}>
                Find answers to common questions and explore our knowledge base.
              </Typography>
            </Box>
            <Chip
              icon={<Shield sx={{ fontSize: 14 }} />}
              label="Utility"
              size="small"
              variant="outlined"
              sx={{ borderColor: colors.gray300, color: colors.gray600 }}
            />
          </Box>
        </Box>

        {activeCategory === 'main' ? (
          // Main Support Page
          <>
            {/* Service Help Cards */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                Service Help
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 5 }}>
                {[
                  {
                    id: 'utilities',
                    icon: Construction,
                    title: 'Utilities',
                    desc: 'Water, sewer, trash & recycling services',
                    color: colors.blurple500,
                    bgColor: `${colors.blurple500}15`,
                    path: '/unified-portal/utilities',
                  },
                  {
                    id: 'taxes',
                    icon: AccountBalance,
                    title: 'Taxes',
                    desc: 'Property & business tax information',
                    color: colors.blurple500,
                    bgColor: `${colors.blurple500}15`,
                    path: '/unified-portal/taxes',
                  },
                  {
                    id: 'permits',
                    icon: Description,
                    title: 'Permits & Licensing',
                    desc: 'Building permits, business licenses & more',
                    color: colors.blurple500,
                    bgColor: colors.blurple50,
                    path: '/unified-portal/permits',
                  },
                  {
                    id: 'parks',
                    icon: Park,
                    title: 'Parks & Recreation',
                    desc: 'Park passes, facility rentals & programs',
                    color: colors.blurple500,
                    bgColor: `${colors.blurple500}15`,
                    path: '/unified-portal/parks',
                  },
                  {
                    id: 'licenses',
                    icon: Gavel,
                    title: 'Licenses',
                    desc: 'Professional & personal licensing',
                    color: colors.gray600,
                    bgColor: colors.gray100,
                    path: '/unified-portal/licenses',
                  },
                  {
                    id: 'grants',
                    icon: CardGiftcard,
                    title: 'Grants & Funding',
                    desc: 'Grant applications & funding opportunities',
                    color: colors.blurple500,
                    bgColor: colors.blurple50,
                    path: '/unified-portal/grants',
                  },
                ].map((service) => {
                  const Icon = service.icon;
                  return (
                    <Card
                      key={service.id}
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        border: `1px solid ${colors.gray200}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: colors.gray300,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => navigate(service.path)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '10px',
                          bgcolor: service.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}>
                          <Icon sx={{ fontSize: 24, color: service.color }} />
                        </Box>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                          {service.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, lineHeight: 1.5 }}>
                          {service.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>

            {/* General Help Categories */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                General Help
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 5 }}>
                {[
                  {
                    id: 'billing' as FaqCategory,
                    icon: Description,
                    title: 'Billing FAQ',
                    desc: 'Get answers about your bills, charges, and billing cycles.',
                    color: colors.blurple500,
                    bgColor: colors.blurple50,
                  },
                  {
                    id: 'payment' as FaqCategory,
                    icon: Payment,
                    title: 'Payment Help',
                    desc: 'Learn about payment methods, processing times, and options.',
                    color: colors.blurple500,
                    bgColor: `${colors.blurple500}15`,
                  },
                  {
                    id: 'account' as FaqCategory,
                    icon: Person,
                    title: 'Account Management',
                    desc: 'Manage your profile, settings, and account preferences.',
                    color: colors.blurple500,
                    bgColor: `${colors.blurple500}15`,
                  },
                ].map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                      key={category.id}
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        border: `1px solid ${colors.gray200}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: colors.gray300,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '10px',
                          bgcolor: category.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}>
                          <Icon sx={{ fontSize: 24, color: category.color }} />
                        </Box>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                        {category.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.gray500, mb: 2, lineHeight: 1.5 }}>
                        {category.desc}
                      </Typography>
                      <Button
                        startIcon={<Description sx={{ fontSize: 16 }} />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          color: colors.blurple500,
                          p: 0,
                          '&:hover': { bgcolor: 'transparent' },
                        }}
                      >
                        View articles
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              </Box>
            </Box>

            {/* Get Support Section */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                Get Support
              </Typography>
              <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                <CardContent sx={{ p: 3, display: 'flex', gap: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      bgcolor: colors.blurple100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Email sx={{ fontSize: 20, color: colors.blurple500 }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                        Email Support
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.gray500 }}>
                        Email us anytime:{' '}
                        <Typography
                          component="a"
                          href="mailto:support@cloudcity.com"
                          sx={{ color: colors.blurple500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          support@cloudcity.com
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      bgcolor: colors.blurple100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Phone sx={{ fontSize: 20, color: colors.blurple500 }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                        Phone Support
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.gray500 }}>
                        Call us from 9am - 4pm Mon - Fri: 1-800-123-4567
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Main FAQs */}
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                Frequently Asked Questions
              </Typography>
              <Box>
                {mainFaqs.map((faq, index) => {
                  const isFirst = index === 0;
                  const isLast = index === mainFaqs.length - 1;
                  return (
                    <Accordion
                      key={index}
                      expanded={expandedFaq === `main-${index}`}
                      onChange={handleFaqChange(`main-${index}`)}
                      elevation={0}
                      disableGutters
                      sx={{
                        '&:before': { display: 'none' },
                        border: `1px solid ${colors.gray200}`,
                        borderTop: isFirst ? `1px solid ${colors.gray200}` : 'none',
                        borderRadius: isFirst 
                          ? '8px 8px 0 0' 
                          : isLast 
                            ? '0 0 8px 8px' 
                            : 0,
                        bgcolor: colors.white,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color: colors.gray500 }} />}
                        sx={{
                          px: 3,
                          py: 1,
                          '&:hover': { bgcolor: colors.gray50 },
                          '& .MuiAccordionSummary-content': { my: 1.5 },
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 500, color: colors.gray800 }}>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                        <Typography variant="body2" sx={{ color: colors.gray600, lineHeight: 1.6 }}>
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </Box>
          </>
        ) : (
          // FAQ Category Page (Billing, Payment, Account)
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 4 }}>
            {/* FAQ Content */}
            <Box>
              {getCurrentFaqs().map((faq, index) => {
                const isFirst = index === 0;
                const isLast = index === getCurrentFaqs().length - 1;
                return (
                  <Accordion
                    key={index}
                    expanded={expandedFaq === `faq-${index}`}
                    onChange={handleFaqChange(`faq-${index}`)}
                    elevation={0}
                    disableGutters
                    sx={{
                      '&:before': { display: 'none' },
                      border: `1px solid ${colors.gray200}`,
                      borderTop: isFirst ? `1px solid ${colors.gray200}` : 'none',
                      borderRadius: isFirst 
                        ? '8px 8px 0 0' 
                        : isLast 
                          ? '0 0 8px 8px' 
                          : 0,
                      bgcolor: colors.white,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: colors.gray500 }} />}
                      sx={{
                        px: 3,
                        py: 1,
                        '&:hover': { bgcolor: colors.gray50 },
                        '& .MuiAccordionSummary-content': { my: 1.5 },
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500, color: colors.gray800 }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                      <Typography variant="body2" sx={{ color: colors.gray600, lineHeight: 1.6 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>

            {/* Sidebar */}
            <SupportSidebar />
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 4, mt: 4, borderTop: `1px solid ${colors.gray200}` }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              onClick={() => window.open('/terms', '_blank')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Terms of Service
            </Button>
            <Button
              onClick={() => window.open('/privacy', '_blank')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Privacy Policy
            </Button>
            <Button
              onClick={() => navigate('/unified-portal')}
              sx={{ textTransform: 'none', color: colors.gray500, p: 0, minWidth: 'auto', '&:hover': { color: colors.blurple500 } }}
            >
              Back to Home
            </Button>
          </Box>
          <Typography variant="caption" sx={{ color: colors.gray400 }}>© 2025 Cloud City customer portal. All rights reserved.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportPage;

