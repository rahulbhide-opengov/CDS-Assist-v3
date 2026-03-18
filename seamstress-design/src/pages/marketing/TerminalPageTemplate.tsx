/**
 * TerminalPageTemplate
 *
 * Long-form blog-style content page for capabilities, features, or articles.
 * Example content: Agent Studio - detailed explanation of AI agent capabilities.
 * Supports light/dark mode via marketing theme.
 */

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { East, SmartToy } from '@mui/icons-material';
import { marketingStyles } from '../../theme/marketing-styles';
import { FeaturedCard, ProfileLockup, MarketingSection } from '../../components/marketing/primitives';
import { useMarketingTheme } from '../../contexts/MarketingThemeContext';

// Capabilities list for arrow bullets
const capabilities = [
  'Build AI agents your way—no coding required',
  'Connect to the data you already have',
  'Automate the workflows that eat up your day',
  'See exactly what every agent does, when',
  'Deploy with confidence in your government cloud',
];

// Key capabilities for callout box
const keyCapabilities = [
  'Understand what residents are really asking',
  'Route approvals automatically—no more bottlenecks',
  'Read documents and extract the data you need',
  'Draft responses for staff to review and send',
];

// Use cases
const useCases = [
  {
    title: 'Permit Routing',
    description: 'Applications find their way to the right reviewer instantly. No more forwarding, no more delays.',
  },
  {
    title: 'Citizen Inquiries',
    description: 'Common questions answered in seconds. Complex issues routed to the right person with full context.',
  },
  {
    title: 'Document Processing',
    description: 'Forms, contracts, invoices—data extracted and entered while your staff handles what matters.',
  },
];

// Related content cards
const relatedContent = [
  {
    title: 'App Builder',
    description: 'Turn your ideas into working applications—no developers required.',
    href: '/marketing/platform/app-builder',
    badge: { label: 'Platform', variant: 'info' as const },
  },
  {
    title: 'Reporting Suite',
    description: 'Real-time dashboards that answer your questions before you ask them.',
    href: '/marketing/platform/reporting',
    badge: { label: 'Platform', variant: 'info' as const },
  },
];

const TerminalPageTemplate: React.FC = () => {
  const { marketingColors } = useMarketingTheme();

  return (
    <Box>
      {/* SECTION 1: ARTICLE HERO (centered) */}
      <Box sx={{ bgcolor: marketingColors.surface, pt: { xs: 8, md: 12 }, pb: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 }, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: { xs: 4, md: 6 } }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-block',
                px: 2,
                py: 0.75,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '4px',
                mb: 3,
                bgcolor: marketingColors.accentBgLight,
                color: marketingColors.accent,
              }}
            >
              There's a better way
            </Box>

            <Typography component="h1" sx={{ ...marketingStyles.displayHeading, color: marketingColors.foreground }}>
              Give your team superpowers. Keep the humans in charge.
            </Typography>
            <Typography sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' }, color: marketingColors.muted, lineHeight: 1.6, maxWidth: 640, mx: 'auto' }}>
              Agent Studio lets you build AI assistants that handle the repetitive work—so your staff can focus on the decisions that actually need human judgment.
            </Typography>
          </Box>

          {/* Hero image */}
          <Box
            component="img"
            src="/images/marketing/agent-studio/dashboard.png"
            alt="Agent Studio Dashboard showing key performance indicators and agent usage analytics"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
              my: 10,
            }}
          />
        </Container>
      </Box>

      {/* SECTION 2: ARTICLE BODY - What is Agent Studio? */}
      <Box sx={{ bgcolor: marketingColors.surface, py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 }, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={marketingStyles.articleContainer}>
            <Typography component="h2" sx={{ ...marketingStyles.articleHeading, color: marketingColors.foreground }}>
              What is Agent Studio?
            </Typography>
            <Box sx={{ ...marketingStyles.articleBody, color: marketingColors.muted }}>
              <Typography component="p">
                Your staff spends hours every day on tasks that follow the same pattern: read the request, look up information, route to the right person, send a response. Agent Studio lets you build AI assistants—agents—that handle this work automatically. Not with rigid rules that break, but with intelligence that understands what people are actually asking.
              </Typography>
              <Typography component="p">
                Permit questions answered at 2 AM. Documents routed before anyone touches them. Forms processed while your team handles the cases that truly need their expertise. That's what agents do—and they do it 24/7, without coffee breaks.
              </Typography>
            </Box>

            {/* Arrow bullet list */}
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: marketingColors.foreground, mb: 2 }}>
                What becomes possible:
              </Typography>
              <Box component="ul" sx={marketingStyles.arrowList}>
                {capabilities.map((cap) => (
                  <li key={cap}>
                    <Typography sx={{ fontSize: '1rem', color: marketingColors.muted }}>
                      {cap}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SECTION 3: CUSTOMER QUOTE (full-bleed image background) */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 10, md: 14 },
          px: { xs: 2, sm: 3, md: 4 },
          my: 0,
          backgroundImage: 'url(/images/marketing/starkville-mississippi/our-customers-77-1920.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: marketingColors.border,
          backgroundBlendMode: 'overlay',
          '&::before': {
            position: 'absolute',
            inset: 0,
            bgcolor: marketingColors.surface,
          },
        }}
      >
        <Container maxWidth="md" disableGutters sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Quote text */}
            <Typography
              sx={{
                fontSize: '2.2rem',
                fontWeight: 400,
                lineHeight: 1.5,
                color: marketingColors.foreground,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Our residents used to wait days for answers. Now they hear back in hours—sometimes minutes. And my team finally has time for the work that made them want to serve their community in the first place.
            </Typography>

            {/* Author info */}
            <Typography
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: marketingColors.foreground,
              }}
            >
              Sarah Mitchell
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                color: marketingColors.muted,
              }}
            >
              City Manager, Starkville, Mississippi
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* SECTION 4: INLINE IMAGE */}
      <Box sx={{ bgcolor: marketingColors.surface, py: 10, px: { xs: 2, sm: 3, md: 4 }, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Box
              component="img"
              src="/images/marketing/agent-studio/skill-editor.png"
              alt="Agent Studio Skill Editor interface showing tools panel and content editor"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
              }}
            />
            <Typography sx={{ ...marketingStyles.imageCaption, color: marketingColors.muted }}>
              Build agent skills visually—connect your data, define the logic, and deploy
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* SECTION 5: ARTICLE BODY CONTINUED - How It Works */}
      <Box sx={{ bgcolor: marketingColors.surface, py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 }, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={marketingStyles.articleContainer}>
            <Typography component="h2" sx={{ ...marketingStyles.articleHeading, color: marketingColors.foreground }}>
              How It Works
            </Typography>
            <Box sx={{ ...marketingStyles.articleBody, color: marketingColors.muted }}>
              <Typography component="p">
                Start by choosing what you want your agent to do. Answer permit questions? Route documents? Process form submissions? Each agent gets trained on your specific processes, your data, your way of doing things.
              </Typography>
              <Typography component="p">
                The visual builder makes it simple: drag, connect, test. You decide what triggers an action, what data gets pulled, when a human needs to step in. No coding, no consultants—just you shaping how work flows through your organization.
              </Typography>
              <Typography component="p">
                Hit deploy, and your agent goes to work. Every action logged, every decision traceable, every outcome measurable. You'll know exactly what's happening, and so will your auditors.
              </Typography>
            </Box>

            {/* Pull quote */}
            <Box sx={{ ...marketingStyles.pullQuote, borderColor: marketingColors.accent, color: marketingColors.foreground }}>
              <Typography sx={{ fontSize: '1.125rem' }}>
                "The goal was never to replace people—it was to give them time back for the work that actually requires human judgment. That's what excellent government looks like."
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: marketingColors.muted, mt: 1, fontStyle: 'normal' }}>
                — Maria Chen, VP of Product, OpenGov
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SECTION 6: CALLOUT BOX (gray bg inset) */}
      <Box sx={{ bgcolor: marketingColors.surface, py: { xs: 2, md: 4 }, px: { xs: 2, sm: 3, md: 4 }, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={marketingStyles.articleContainer}>
            <Box sx={{ ...marketingStyles.calloutBox, bgcolor: marketingColors.background, borderColor: marketingColors.border }}>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: marketingColors.foreground, mb: 2 }}>
                What agents can do for you
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {keyCapabilities.map((cap) => (
                  <li key={cap}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: marketingColors.accentBgLight,
                          color: marketingColors.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        ✓
                      </Box>
                      <Typography sx={{ fontSize: '1rem', color: marketingColors.muted }}>
                        {cap}
                      </Typography>
                    </Box>
                  </li>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SECTION 7: USE CASES SECTION */}
      <Box sx={{ bgcolor: marketingColors.surface, py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3, md: 4 }, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={marketingStyles.articleContainer}>
            <Typography component="h2" sx={{ ...marketingStyles.articleHeading, color: marketingColors.foreground }}>
              Start with what works
            </Typography>
            <Typography sx={{ ...marketingStyles.articleBody, mb: 4, color: marketingColors.muted }}>
              Don't build from scratch. These templates were designed with governments like yours—proven patterns you can customize and deploy in days, not months.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 0, sm: 3 } }}>
            <Box sx={marketingStyles.threeColumnGrid}>
              {useCases.map((useCase) => (
                <Box
                  key={useCase.title}
                  sx={{
                    bgcolor: marketingColors.background,
                    border: `1px solid ${marketingColors.border}`,
                    borderRadius: '8px',
                    p: 3,
                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        bgcolor: marketingColors.accentBgLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: marketingColors.accent,
                      }}
                    >
                      <SmartToy sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: marketingColors.foreground }}>
                      {useCase.title}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.9375rem', color: marketingColors.muted, lineHeight: 1.6 }}>
                    {useCase.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SECTION 8: CUSTOMER PROFILE */}
      <MarketingSection variant="light" py={{ xs: 8, md: 12 }}>
        <ProfileLockup
          name="Sarah Mitchell"
          title="City Manager, Starkville, Mississippi"
          bio={[
            'Sarah has served as City Manager for Starkville since 2019, overseeing a staff of 450 employees and an annual budget of $85 million. Under her leadership, Starkville became one of the first cities in Mississippi to deploy AI-powered citizen services.',
            'Since implementing Agent Studio, Starkville has reduced average response times for citizen inquiries from 3 days to under 4 hours. The city now processes permit applications 60% faster while maintaining the same staff levels.',
          ]}
          imageUrl="/images/marketing/starkville-mississippi/our-customers-75-1200.webp"
          linkedInUrl="https://linkedin.com"
        />
      </MarketingSection>

      {/* SECTION 9: RELATED CONTENT (light gray bg) */}
      <Box sx={{ bgcolor: marketingColors.background, py: { xs: 8, md: 10 }, px: { xs: 2, sm: 3, md: 4 }, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography component="span" sx={{ ...marketingStyles.eyebrowLabel, color: marketingColors.accent }}>
              Keep exploring
            </Typography>
            <Typography component="h2" sx={{ ...marketingStyles.sectionHeading, fontSize: { xs: '1.5rem', md: '2rem' }, color: marketingColors.foreground }}>
              More ways to work smarter
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            {relatedContent.map((content) => (
              <FeaturedCard
                key={content.title}
                href={content.href}
                title={content.title}
                description={content.description}
                badge={content.badge}
                width={320}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* SECTION 10: CTA BANNER */}
      <Box sx={{ bgcolor: marketingColors.accent, py: { xs: 8, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Container maxWidth="md" disableGutters>
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: marketingColors.invertedText, mb: 2, lineHeight: 1.2 }}>
              Your team's time is too valuable for busywork.
            </Typography>
            <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: marketingColors.invertedTextMuted, mb: 4, maxWidth: 480, mx: 'auto' }}>
              Every repetitive task you automate is time given back to the work that truly needs your staff's expertise. Let's start there.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<East />}
                sx={{
                  bgcolor: marketingColors.invertedText,
                  color: marketingColors.accent,
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: marketingColors.invertedTextMuted, boxShadow: 'none' },
                }}
              >
                See it in action
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: marketingColors.invertedTextMuted,
                  color: marketingColors.invertedText,
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { borderColor: marketingColors.invertedText, bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                Talk to our team
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default TerminalPageTemplate;
