/**
 * MarketingNavigation
 *
 * Main navigation component for marketing pages.
 * Features full-width mega-nav dropdowns matching OpenGov.com design.
 * Fully theme-aware with light/dark mode support.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
  Fade,
} from '@mui/material';
import {
  KeyboardArrowDown,
  Search,
  Menu as MenuIcon,
  Close,
  ExpandMore,
  ExpandLess,
  East,
  Widgets,
  SmartToy,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import {
  FileDocumentOutline,
  OfficeBuilding,
  ChartLine,
  BellRingOutline,
  Tools,
  CashMultiple,
  AccountGroup,
  ClipboardCheckOutline,
  WaterOutline,
  ChartTimeline,
  ShoppingCartOutline,
  CashSync,
  AlertCircleOutline,
  CalculatorVariant,
  HandCoin,
} from '@opengov/react-capital-assets';
import { useNavigate } from 'react-router-dom';
import { cdsColors } from '../../theme/cds';
import {
  utilityLinks,
  megaMenus,
  platformHero,
  platformFeatures,
  platformProducts,
  departmentSections,
  resourcesSections,
  resourcesFeatured,
  customerStories,
  companySections,
  companyFeatured,
} from '../../config/marketingNavConfig';
import {
  IconBadge,
  LinkColumn,
  FeaturedCard,
  HoverCard,
  CtaLink,
  MenuSectionTitle,
  ThemedLogo,
} from './primitives';
import { useMarketingTheme } from '../../contexts/MarketingThemeContext';

const colors = cdsColors;

// Map icon names to icon components
const iconMap: Record<string, React.ComponentType> = {
  OfficeBuilding,
  ChartLine,
  BellRingOutline,
  Tools,
  CashMultiple,
  AccountGroup,
  ClipboardCheckOutline,
  WaterOutline,
  ChartTimeline,
  ShoppingCartOutline,
  CashSync,
  AlertCircleOutline,
  CalculatorVariant,
  HandCoin,
};

const MarketingNavigation: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { marketingMode, toggleMarketingTheme, marketingColors, isDark } = useMarketingTheme();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('public-works-infrastructure');
  const [selectedResource, setSelectedResource] = useState<string>('support');
  const [selectedCompany, setSelectedCompany] = useState<string>('about-us');

  // Mobile category expansion states
  const [expandedDepartmentCategory, setExpandedDepartmentCategory] = useState<string | null>(null);
  const [expandedResourceCategory, setExpandedResourceCategory] = useState<string | null>(null);
  const [expandedCompanyCategory, setExpandedCompanyCategory] = useState<string | null>(null);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Theme-aware colors for selected/highlight states (using palette tokens)
  const selectedBgColor = marketingColors.accentBgLight;
  const selectedBorderColor = marketingColors.accentBorder;
  const iconBgColor = marketingColors.iconBg;
  const cardGradient = isDark
    ? `linear-gradient(135deg, ${marketingColors.accentBgMedium} 0%, rgba(75, 63, 255, 0.3) 100%)`
    : `linear-gradient(135deg, ${colors.blurple100} 0%, ${colors.blurple200} 100%)`;

  const handleMenuOpen = useCallback((menuId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(menuId);

    // Auto-select first category when opening departments, resources, or company
    if (menuId === 'departments') {
      setSelectedDepartment('public-works-infrastructure');
    } else if (menuId === 'resources') {
      setSelectedResource('support');
    } else if (menuId === 'company') {
      setSelectedCompany('about-us');
    }
  }, []);

  const handleMenuClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, []);

  const handleMenuEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const toggleMobileSubmenu = (menuId: string) => {
    setExpandedMobileMenu(expandedMobileMenu === menuId ? null : menuId);
  };

  // Helper function to convert department title to ID (kebab-case)
  const getDepartmentId = (title: string): string => {
    return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  };

  // Platform Menu Content
  const renderPlatformMenu = () => (
    <Box sx={{ display: 'flex', gap: 0 }}>
      {/* Left Sidebar - Platform Hero + Capabilities */}
      <Box
        sx={{
          width: 300,
          flexShrink: 0,
          pr: 4,
          borderRight: `1px solid ${marketingColors.border}`,
          position: 'relative',
        }}
      >
        {/* Platform Hero */}
        <Box sx={{ mb: 3 }}>
          <FeaturedCard
            href="/platform"
            title="The Public Service Platform for modern government"
            description="One unified platform powering every product, connecting every department, serving every resident."
            ctaLabel="Explore platform"
            width="100%"
          />
        </Box>

        {/* Capabilities Section */}
        <MenuSectionTitle>Capabilities</MenuSectionTitle>

        {/* Capability Cards */}
        {platformFeatures.map((feature) => (
          <HoverCard
            key={feature.href}
            href={feature.href}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              p: 2.5,
              mb: 2,
              '&:hover': {
                borderColor: marketingColors.accent,
                bgcolor: marketingColors.hoverBg,
                '& .feature-title': {
                  color: marketingColors.accent,
                },
                '& .feature-arrow': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                bgcolor: iconBgColor,
                flexShrink: 0,
                '& svg': {
                  fontSize: 18,
                  color: marketingColors.accent,
                },
              }}
            >
              {feature.icon === 'app-builder' ? <Widgets /> : <SmartToy />}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  className="feature-title"
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: marketingColors.foreground,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {feature.title}
                </Typography>
                <East
                  className="feature-arrow"
                  sx={{
                    fontSize: 16,
                    color: marketingColors.accent,
                    opacity: 0,
                    transform: 'translateX(-8px)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', color: marketingColors.muted, lineHeight: 1.4 }}>
                {feature.description}
              </Typography>
            </Box>
          </HoverCard>
        ))}
      </Box>

      {/* Right Side - Products Grid */}
      <Box sx={{ flex: 1, pl: 5 }}>
        <MenuSectionTitle>Products</MenuSectionTitle>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.75 }}>
          {platformProducts.map((product) => {
            const IconComponent = iconMap[product.icon] || FileDocumentOutline;

            return (
              <Box
                key={product.href}
                component="a"
                href={product.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1,
                  px: 1.5,
                  textDecoration: 'none',
                  borderRadius: '6px',
                  border: `1px solid transparent`,
                  bgcolor: 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: marketingColors.hoverBg,
                    borderColor: marketingColors.accent,
                    '& .product-title': {
                      color: marketingColors.accent,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    bgcolor: iconBgColor,
                    '& svg': {
                      fontSize: 18,
                      color: marketingColors.accent,
                    },
                  }}
                >
                  <IconComponent />
                </Box>
                <Typography
                  className="product-title"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: marketingColors.foreground,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {product.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );

  // Departments Menu Content
  const renderDepartmentsMenu = () => {
    // Find selected department data
    const selectedDept = departmentSections.find(
      (section) => getDepartmentId(section.title) === selectedDepartment
    );

    return (
      <Box sx={{ display: 'flex', gap: 0 }}>
        {/* Left Panel - Department Categories (ServeScape style) */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            pr: 5,
          }}
        >
          {departmentSections.map((section) => {
            const deptId = getDepartmentId(section.title);
            const isSelected = selectedDepartment === deptId;

            return (
              <Box
                key={section.title}
                onMouseEnter={() => setSelectedDepartment(deptId)}
                sx={{
                  py: 1.75,
                  px: 2.5,
                  mb: 0.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '8px',
                  border: `1px solid ${isSelected ? selectedBorderColor : 'transparent'}`,
                  bgcolor: isSelected ? selectedBgColor : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isSelected ? selectedBgColor : marketingColors.hoverBg,
                    borderColor: isSelected ? selectedBorderColor : marketingColors.border,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? marketingColors.accent : marketingColors.foreground,
                    lineHeight: 1.2,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {section.title}
                </Typography>
                <East
                  sx={{
                    fontSize: 16,
                    color: isSelected ? marketingColors.accent : marketingColors.muted,
                    opacity: isSelected ? 1 : 0,
                    transform: isSelected ? 'translateX(0)' : 'translateX(-4px)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Right Panel - Module Cards with Images */}
        <Box sx={{ flex: 1, pl: 5, borderLeft: `1px solid ${marketingColors.border}` }}>
          <Fade in={true} timeout={200} key={selectedDepartment}>
            <Box>
              {/* Module Cards Grid - Fixed columns for symmetry */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2.5,
                }}
              >
                {selectedDept?.links.map((link) => (
                  <Box
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      textDecoration: 'none',
                      borderRadius: '12px',
                      border: `1px solid ${marketingColors.border}`,
                      bgcolor: marketingColors.surface,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: marketingColors.accent,
                        bgcolor: marketingColors.hoverBg,
                        transform: 'translateY(-4px)',
                        boxShadow: isDark ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
                        '& .department-title': {
                          color: marketingColors.accent,
                        },
                      },
                    }}
                  >
                    {/* Image Placeholder - Fixed Height */}
                    <Box
                      sx={{
                        height: 120,
                        flexShrink: 0,
                        bgcolor: marketingColors.hoverBg,
                        backgroundImage: cardGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '2rem',
                          opacity: 0.3,
                          color: marketingColors.foreground,
                        }}
                      >
                        {link.label.charAt(0)}
                      </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography
                        className="department-title"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: marketingColors.foreground,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    );
  };

  // Resources Menu Content
  const renderResourcesMenu = () => {
    // Find selected resource category data
    const selectedResourceData = resourcesSections.find(
      (section) => getDepartmentId(section.title) === selectedResource
    );

    return (
      <Box sx={{ display: 'flex', gap: 0 }}>
        {/* Left Panel - Resource Categories + Featured Webinar */}
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            pr: 5,
          }}
        >
          {/* Resource Categories */}
          {resourcesSections.map((section) => {
            const resourceId = getDepartmentId(section.title);
            const isSelected = selectedResource === resourceId;

            return (
              <Box
                key={section.title}
                onMouseEnter={() => setSelectedResource(resourceId)}
                sx={{
                  py: 1.75,
                  px: 2.5,
                  mb: 0.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '8px',
                  border: `1px solid ${isSelected ? selectedBorderColor : 'transparent'}`,
                  bgcolor: isSelected ? selectedBgColor : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isSelected ? selectedBgColor : marketingColors.hoverBg,
                    borderColor: isSelected ? selectedBorderColor : marketingColors.border,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? marketingColors.accent : marketingColors.foreground,
                    lineHeight: 1.2,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {section.title}
                </Typography>
                <East
                  sx={{
                    fontSize: 16,
                    color: isSelected ? marketingColors.accent : marketingColors.muted,
                    opacity: isSelected ? 1 : 0,
                    transform: isSelected ? 'translateX(0)' : 'translateX(-4px)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </Box>
            );
          })}

          {/* Featured Webinar - Always Visible */}
          <Box sx={{ mt: 4 }}>
            <FeaturedCard
              href={resourcesFeatured.href}
              badge={{ label: resourcesFeatured.tag, variant: 'success' }}
              date={resourcesFeatured.date}
              title={resourcesFeatured.title}
              description={resourcesFeatured.description}
              width="100%"
            />
          </Box>
        </Box>

        {/* Right Panel - Resource Cards */}
        <Box sx={{ flex: 1, pl: 5, borderLeft: `1px solid ${marketingColors.border}` }}>
          <Fade in={true} timeout={200} key={selectedResource}>
            <Box>
              {/* Resource Cards Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2.5,
                }}
              >
                {selectedResourceData?.links.map((link) => (
                  <Box
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      textDecoration: 'none',
                      borderRadius: '12px',
                      border: `1px solid ${marketingColors.border}`,
                      bgcolor: marketingColors.surface,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: marketingColors.accent,
                        bgcolor: marketingColors.hoverBg,
                        transform: 'translateY(-4px)',
                        boxShadow: isDark ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
                        '& .resource-title': {
                          color: marketingColors.accent,
                        },
                      },
                    }}
                  >
                    {/* Image Placeholder - Fixed Height */}
                    <Box
                      sx={{
                        height: 120,
                        flexShrink: 0,
                        bgcolor: marketingColors.hoverBg,
                        backgroundImage: cardGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '2rem',
                          opacity: 0.3,
                          color: marketingColors.foreground,
                        }}
                      >
                        {link.label.charAt(0)}
                      </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography
                        className="resource-title"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: marketingColors.foreground,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    );
  };

  // Customers Menu Content
  const renderCustomersMenu = () => {
    // Customer images for the cards
    const customerImages = [
      '/images/marketing/taylor-county-west-virginia/our-customers-13-1200.jpg',
      '/images/marketing/taylor-county-west-virginia/our-customers-15-800.jpg',
      '/images/marketing/taylor-county-west-virginia/our-customers-dam2-1200.webp',
    ];

    return (
      <Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, mb: 4 }}>
          {customerStories.map((story, index) => (
            <Box
              key={story.href}
              component="a"
              href={story.href}
              sx={{
                textDecoration: 'none',
                borderRadius: '12px',
                border: `1px solid ${marketingColors.border}`,
                bgcolor: marketingColors.surface,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: marketingColors.accent,
                  bgcolor: marketingColors.hoverBg,
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
                  '& .customer-title': {
                    color: marketingColors.accent,
                  },
                  '& .customer-image': {
                    transform: 'scale(1.05)',
                  },
                  '& .cta-link': {
                    color: marketingColors.accent,
                    '& .MuiTypography-root': {
                      color: marketingColors.accent,
                    },
                    '& .MuiSvgIcon-root': {
                      color: marketingColors.accent,
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                },
              }}
            >
              <Box
                className="customer-image"
                sx={{
                  height: 160,
                  bgcolor: marketingColors.hoverBg,
                  backgroundImage: `url(${customerImages[index]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.3s ease',
                }}
              />
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography
                  className="customer-title"
                  sx={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: marketingColors.foreground,
                    mb: 1.5,
                    lineHeight: 1.3,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {story.title}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: marketingColors.muted, mb: 2, lineHeight: 1.5 }}>
                  {story.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <CtaLink href={story.href}>Read story</CtaLink>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ borderTop: `1px solid ${marketingColors.border}`, pt: 4, textAlign: 'center' }}>
        <Button
          href="/customers"
          sx={{
            color: marketingColors.foreground,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9375rem',
            px: 4,
            py: 1.5,
            border: `1px solid ${marketingColors.border}`,
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            position: 'relative',
            pr: 4.5,
            '&:hover': {
              bgcolor: selectedBgColor,
              borderColor: marketingColors.accent,
              color: marketingColors.accent,
              pr: 6,
              '& .view-all-arrow': {
                opacity: 1,
                transform: 'translateX(8px)',
              },
            },
          }}
        >
          View all customer stories
          <East
            className="view-all-arrow"
            sx={{
              fontSize: 20,
              position: 'absolute',
              right: 16,
              opacity: 0,
              transform: 'translateX(0)',
              transition: 'all 0.2s ease',
            }}
          />
        </Button>
        <Typography sx={{ fontSize: '0.875rem', color: marketingColors.muted, mt: 1.5 }}>
          Explore success stories by region, department, and platform
        </Typography>
        </Box>
      </Box>
    );
  };

  // Company Menu Content
  const renderCompanyMenu = () => {
    // Find selected company category data
    const selectedCompanyData = companySections.find(
      (section) => getDepartmentId(section.title) === selectedCompany
    );

    return (
      <Box sx={{ display: 'flex', gap: 0 }}>
        {/* Left Panel - Company Categories + Featured Card */}
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            pr: 5,
          }}
        >
          {/* Company Categories */}
          {companySections.map((section) => {
            const companyId = getDepartmentId(section.title);
            const isSelected = selectedCompany === companyId;

            return (
              <Box
                key={section.title}
                onMouseEnter={() => setSelectedCompany(companyId)}
                sx={{
                  py: 1.75,
                  px: 2.5,
                  mb: 0.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '8px',
                  border: `1px solid ${isSelected ? selectedBorderColor : 'transparent'}`,
                  bgcolor: isSelected ? selectedBgColor : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isSelected ? selectedBgColor : marketingColors.hoverBg,
                    borderColor: isSelected ? selectedBorderColor : marketingColors.border,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? marketingColors.accent : marketingColors.foreground,
                    lineHeight: 1.2,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {section.title}
                </Typography>
                <East
                  sx={{
                    fontSize: 16,
                    color: isSelected ? marketingColors.accent : marketingColors.muted,
                    opacity: isSelected ? 1 : 0,
                    transform: isSelected ? 'translateX(0)' : 'translateX(-4px)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </Box>
            );
          })}

          {/* Featured Leadership Card - Always Visible */}
          <Box sx={{ mt: 4 }}>
            <FeaturedCard
              href={companyFeatured.href}
              gradient="linear-gradient(135deg, #1a1a2e 0%, #374151 100%)"
              {...(companyFeatured.tag && { badge: { label: companyFeatured.tag, variant: 'info' } })}
              title={companyFeatured.title}
              description={companyFeatured.description}
              width="100%"
            />
          </Box>
        </Box>

        {/* Right Panel - Company Cards */}
        <Box sx={{ flex: 1, pl: 5, borderLeft: `1px solid ${marketingColors.border}` }}>
          <Fade in={true} timeout={200} key={selectedCompany}>
            <Box>
              {/* Company Cards Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 2.5,
                }}
              >
                {selectedCompanyData?.links.map((link) => (
                  <Box
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      textDecoration: 'none',
                      borderRadius: '12px',
                      border: `1px solid ${marketingColors.border}`,
                      bgcolor: marketingColors.surface,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: marketingColors.accent,
                        bgcolor: marketingColors.hoverBg,
                        transform: 'translateY(-4px)',
                        boxShadow: isDark ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
                        '& .company-title': {
                          color: marketingColors.accent,
                        },
                      },
                    }}
                  >
                    {/* Image Placeholder - Fixed Height */}
                    <Box
                      sx={{
                        height: 120,
                        flexShrink: 0,
                        bgcolor: marketingColors.hoverBg,
                        backgroundImage: cardGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '2rem',
                          opacity: 0.3,
                          color: marketingColors.foreground,
                        }}
                      >
                        {link.label.charAt(0)}
                      </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography
                        className="company-title"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: marketingColors.foreground,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    );
  };

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'platform': return renderPlatformMenu();
      case 'departments': return renderDepartmentsMenu();
      case 'resources': return renderResourcesMenu();
      case 'customers': return renderCustomersMenu();
      case 'company': return renderCompanyMenu();
      default: return null;
    }
  };

  // Mobile-specific render functions
  const renderPlatformMenuMobile = () => (
    <List component="div" disablePadding>
      {/* Platform Hero Card - Simplified */}
      <Box sx={{ px: 3, pt: 2, mb: 1 }}>
        <Box sx={{ py: 2, px: 2.5, bgcolor: selectedBgColor, borderRadius: 1 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: marketingColors.accent, mb: 0.5 }}>
            {platformHero.title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: marketingColors.muted, mb: 1 }}>
            {platformHero.description}
          </Typography>
          <Typography
            component="a"
            href={platformHero.href}
            sx={{ fontSize: '0.75rem', color: marketingColors.accent, fontWeight: 500, textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
          >
            Explore platform →
          </Typography>
        </Box>
      </Box>

      {/* Capabilities Section */}
      <ListItem sx={{ py: 1, px: 3 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: marketingColors.muted, textTransform: 'uppercase' }}>
          Capabilities
        </Typography>
      </ListItem>
      {platformFeatures.map((feature) => (
        <ListItem
          key={feature.href}
          component="a"
          href={feature.href}
          sx={{ py: 1.5, pl: 5, pr: 3, textDecoration: 'none', '&:hover': { bgcolor: marketingColors.hoverBg }, WebkitTapHighlightColor: 'transparent' }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                bgcolor: iconBgColor,
                flexShrink: 0,
                '& svg': {
                  fontSize: 16,
                  color: marketingColors.accent,
                },
              }}
            >
              {feature.icon === 'app-builder' ? <Widgets /> : <SmartToy />}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: marketingColors.foreground }}>
                {feature.title}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: marketingColors.muted }}>
                {feature.description}
              </Typography>
            </Box>
          </Box>
        </ListItem>
      ))}

      {/* Products Section */}
      <ListItem sx={{ py: 1, px: 3, mt: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: marketingColors.muted, textTransform: 'uppercase' }}>
          Products
        </Typography>
      </ListItem>
      {platformProducts.map((product) => {
        const IconComponent = iconMap[product.icon] || FileDocumentOutline;
        return (
          <ListItem
            key={product.href}
            component="a"
            href={product.href}
            sx={{ py: 1, pl: 5, pr: 3, textDecoration: 'none', '&:hover': { bgcolor: marketingColors.hoverBg }, WebkitTapHighlightColor: 'transparent' }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  bgcolor: iconBgColor,
                  flexShrink: 0,
                  '& svg': {
                    fontSize: 16,
                    color: marketingColors.accent,
                  },
                }}
              >
                <IconComponent />
              </Box>
              <Typography sx={{ fontSize: '0.875rem', color: marketingColors.foreground }}>
                {product.label}
              </Typography>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );

  const renderDepartmentsMenuMobile = () => (
    <List component="div" disablePadding>
      {departmentSections.map((section) => {
        const deptId = getDepartmentId(section.title);
        const isExpanded = expandedDepartmentCategory === deptId;

        return (
          <React.Fragment key={deptId}>
            {/* Category Header */}
            <ListItem
              onClick={() => setExpandedDepartmentCategory(isExpanded ? null : deptId)}
              sx={{
                py: 1.5,
                pl: 5,
                pr: 3,
                cursor: 'pointer',
                bgcolor: isExpanded ? selectedBgColor : 'transparent',
                '&:hover': { bgcolor: isExpanded ? selectedBgColor : marketingColors.hoverBg },
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <ListItemText
                primary={section.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isExpanded ? 600 : 500,
                  color: isExpanded ? marketingColors.accent : marketingColors.foreground,
                }}
              />
              {isExpanded ? (
                <ExpandLess sx={{ fontSize: 20, color: marketingColors.accent }} />
              ) : (
                <ExpandMore sx={{ fontSize: 20, color: marketingColors.muted }} />
              )}
            </ListItem>

            {/* Category Links */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.links.map((link) => (
                  <ListItem
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      py: 1,
                      pl: 7,
                      pr: 3,
                      textDecoration: 'none',
                      '&:hover': { bgcolor: marketingColors.hoverBg },
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        fontSize: '0.8125rem',
                        color: marketingColors.muted,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );

  const renderResourcesMenuMobile = () => (
    <List component="div" disablePadding>
      {/* Resource Categories */}
      {resourcesSections.map((section) => {
        const resourceId = getDepartmentId(section.title);
        const isExpanded = expandedResourceCategory === resourceId;

        return (
          <React.Fragment key={resourceId}>
            {/* Category Header */}
            <ListItem
              onClick={() => setExpandedResourceCategory(isExpanded ? null : resourceId)}
              sx={{
                py: 1.5,
                pl: 5,
                pr: 3,
                cursor: 'pointer',
                bgcolor: isExpanded ? selectedBgColor : 'transparent',
                '&:hover': { bgcolor: isExpanded ? selectedBgColor : marketingColors.hoverBg },
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <ListItemText
                primary={section.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isExpanded ? 600 : 500,
                  color: isExpanded ? marketingColors.accent : marketingColors.foreground,
                }}
              />
              {isExpanded ? (
                <ExpandLess sx={{ fontSize: 20, color: marketingColors.accent }} />
              ) : (
                <ExpandMore sx={{ fontSize: 20, color: marketingColors.muted }} />
              )}
            </ListItem>

            {/* Category Links */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.links.map((link) => (
                  <ListItem
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      py: 1,
                      pl: 7,
                      pr: 3,
                      textDecoration: 'none',
                      '&:hover': { bgcolor: marketingColors.hoverBg },
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        fontSize: '0.8125rem',
                        color: marketingColors.muted,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}

      {/* Featured Webinar - Below Categories */}
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Box sx={{ py: 2, px: 2.5, bgcolor: marketingColors.hoverBg, borderRadius: 1 }}>
          {resourcesFeatured.tag && (
            <Box
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                fontSize: '0.625rem',
                fontWeight: 600,
                borderRadius: '4px',
                bgcolor: marketingColors.successBg,
                color: marketingColors.successText,
                mb: 0.5,
              }}
            >
              {resourcesFeatured.tag}
            </Box>
          )}
          {resourcesFeatured.date && (
            <Typography sx={{ fontSize: '0.75rem', color: marketingColors.muted, mb: 0.5 }}>
              {resourcesFeatured.date}
            </Typography>
          )}
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: marketingColors.foreground, mb: 0.5 }}>
            {resourcesFeatured.title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: marketingColors.muted, mb: 1 }}>
            {resourcesFeatured.description}
          </Typography>
          <Typography
            component="a"
            href={resourcesFeatured.href}
            sx={{ fontSize: '0.75rem', color: marketingColors.accent, fontWeight: 500, textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
          >
            Learn more →
          </Typography>
        </Box>
      </Box>
    </List>
  );

  const renderCustomersMenuMobile = () => (
    <List component="div" disablePadding>
      {/* Customer Story Cards */}
      {customerStories.map((story, index) => (
        <Box key={story.href} sx={{ px: 3, mb: 2, ...(index === 0 && { pt: 2 }) }}>
          <Box
            component="a"
            href={story.href}
            sx={{
              display: 'block',
              py: 2,
              px: 2.5,
              bgcolor: marketingColors.hoverBg,
              borderRadius: 1,
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
              '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.12)' : colors.gray100 },
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: marketingColors.foreground, mb: 0.5 }}>
              {story.title}
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: marketingColors.muted, mb: 1, lineHeight: 1.4 }}>
              {story.description}
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: marketingColors.accent, fontWeight: 500 }}>
              Read story →
            </Typography>
          </Box>
        </Box>
      ))}

      {/* View All Link */}
      <Box sx={{ px: 3, pb: 1 }}>
        <Box
          component="a"
          href="/customers"
          sx={{
            display: 'block',
            py: 1.5,
            px: 2.5,
            textDecoration: 'none',
            bgcolor: selectedBgColor,
            borderRadius: 1,
            textAlign: 'center',
            '&:hover': { bgcolor: isDark ? 'rgba(75, 63, 255, 0.25)' : colors.blurple100 },
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: marketingColors.accent,
            }}
          >
            View all customer stories
          </Typography>
        </Box>
      </Box>
    </List>
  );

  const renderCompanyMenuMobile = () => (
    <List component="div" disablePadding>
      {/* Company Categories */}
      {companySections.map((section, index) => {
        const companyId = getDepartmentId(section.title);
        const isExpanded = expandedCompanyCategory === companyId;

        return (
          <React.Fragment key={companyId}>
            {/* Category Header */}
            <ListItem
              onClick={() => setExpandedCompanyCategory(isExpanded ? null : companyId)}
              sx={{
                py: 1.5,
                pl: 5,
                pr: 3,
                cursor: 'pointer',
                bgcolor: isExpanded ? selectedBgColor : 'transparent',
                '&:hover': { bgcolor: isExpanded ? selectedBgColor : marketingColors.hoverBg },
                WebkitTapHighlightColor: 'transparent',
                ...(index === 0 && { pt: 3 }),
              }}
            >
              <ListItemText
                primary={section.title}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isExpanded ? 600 : 500,
                  color: isExpanded ? marketingColors.accent : marketingColors.foreground,
                }}
              />
              {isExpanded ? (
                <ExpandLess sx={{ fontSize: 20, color: marketingColors.accent }} />
              ) : (
                <ExpandMore sx={{ fontSize: 20, color: marketingColors.muted }} />
              )}
            </ListItem>

            {/* Category Links */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.links.map((link) => (
                  <ListItem
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      py: 1,
                      pl: 7,
                      pr: 3,
                      textDecoration: 'none',
                      '&:hover': { bgcolor: marketingColors.hoverBg },
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        fontSize: '0.8125rem',
                        color: marketingColors.muted,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}

      {/* Featured CEO Card - Below Categories */}
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Box sx={{ py: 2, px: 2.5, bgcolor: marketingColors.hoverBg, borderRadius: 1 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: marketingColors.foreground, mb: 0.5 }}>
            {companyFeatured.title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: marketingColors.muted, mb: 1 }}>
            {companyFeatured.description}
          </Typography>
          <Typography
            component="a"
            href={companyFeatured.href}
            sx={{ fontSize: '0.75rem', color: marketingColors.accent, fontWeight: 500, textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
          >
            Learn more →
          </Typography>
        </Box>
      </Box>
    </List>
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: marketingColors.surface,
          width: '100%',
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Top Utility Bar */}
        <Box sx={{ bgcolor: marketingColors.accent }}>
          <Box sx={{ height: 36, display: 'flex', justifyContent: { xs: 'center', lg: 'flex-end' }, alignItems: 'center', gap: 3, px: { xs: 2, sm: 3, md: 4 } }}>
            {utilityLinks.map((link) => (
              <Typography
                key={link.href}
                component="a"
                href={link.href}
                sx={{
                  fontSize: '0.8125rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: colors.white },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Main Navigation */}
        <Box sx={{ py: { xs: 1.5, lg: 0 }, borderBottom: activeMenu ? 'none' : `1px solid ${marketingColors.border}`, bgcolor: marketingColors.surface, width: '100%', transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
          <Box sx={{ height: '100%', py: 0, px: { xs: 2, sm: 3, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              {/* Left section - hamburger on mobile, logo on desktop */}
              <Box sx={{ display: 'flex', alignItems: 'center', flex: { xs: 0, lg: 'none' }, zIndex: 1 }}>
                {isMobile && (
                  <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: marketingColors.foreground }} aria-label="Open menu">
                    <MenuIcon />
                  </IconButton>
                )}
                {!isMobile && (
                  <Box
                    component="a"
                    href="/marketing"
                    onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/marketing'); }}
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  >
                    <ThemedLogo height={24} />
                  </Box>
                )}
              </Box>

              {/* Center section - logo on mobile only */}
              {isMobile && (
                <Box
                  component="a"
                  href="/marketing"
                  onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/marketing'); }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <ThemedLogo height={24} />
                </Box>
              )}

              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 6, flex: 1 }}>
                  {megaMenus.map((menu) => (
                    <Box
                      key={menu.id}
                      onMouseEnter={() => handleMenuOpen(menu.id)}
                      onMouseLeave={handleMenuClose}
                      sx={{ position: 'relative' }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 2,
                          py: 2,
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            width: '110px',
                            height: '2px',
                            backgroundColor: marketingColors.accent,
                            transform: activeMenu === menu.id ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                            opacity: activeMenu === menu.id ? 1 : 0,
                            transformOrigin: 'center',
                            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            color: activeMenu === menu.id ? marketingColors.accent : marketingColors.foreground,
                            transition: 'color 0.2s ease',
                          }}
                        >
                          {menu.label}
                        </Typography>
                        <KeyboardArrowDown
                          sx={{
                            fontSize: 18,
                            color: activeMenu === menu.id ? marketingColors.accent : marketingColors.muted,
                            transition: 'transform 0.2s ease',
                            transform: activeMenu === menu.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Right section - CTA buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: { xs: 0, lg: 'none' }, justifyContent: { xs: 'flex-end', lg: 'flex-start' }, zIndex: 1 }}>
                {!isMobile && (
                  <IconButton sx={{ color: marketingColors.foreground, '&:hover': { bgcolor: marketingColors.hoverBg } }} aria-label="Search">
                    <Search />
                  </IconButton>
                )}
                {!isMobile && (
                  <IconButton
                    onClick={toggleMarketingTheme}
                    sx={{
                      color: marketingColors.foreground,
                      '&:hover': { bgcolor: marketingColors.hoverBg },
                    }}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDark ? <LightMode /> : <DarkMode />}
                  </IconButton>
                )}
                {!isMobile && (
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: marketingColors.border,
                      color: marketingColors.foreground,
                      px: 3,
                      height: 40,
                      borderRadius: '8px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.9375rem',
                      '&:hover': { borderColor: marketingColors.muted, bgcolor: marketingColors.hoverBg },
                    }}
                  >
                    Log in
                  </Button>
                )}
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: marketingColors.accent,
                    color: colors.white,
                    px: { xs: 2, sm: 3 },
                    height: 40,
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                    boxShadow: 'none',
                    '&:hover': { bgcolor: colors.blurple800, boxShadow: 'none' },
                  }}
                >
                  {isMobile ? 'Demo' : 'Request a demo'}
                </Button>
              </Box>
            </Box>
        </Box>

        {/* Full-width Dropdown Panel */}
        <Fade in={!!activeMenu} timeout={200}>
          <Box
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuClose}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              bgcolor: marketingColors.surface,
              borderBottom: `1px solid ${marketingColors.border}`,
              boxShadow: isDark ? '0 10px 40px rgba(0, 0, 0, 0.3)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
              display: activeMenu ? 'block' : 'none',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, maxWidth: '70%', mx: 'auto' }}>
              <Box sx={{ py: 5 }}>{renderMenuContent()}</Box>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => {
          setMobileDrawerOpen(false);
          // Reset category expansion states
          setExpandedDepartmentCategory(null);
          setExpandedResourceCategory(null);
          setExpandedCompanyCategory(null);
        }}
        PaperProps={{ sx: { width: 320, bgcolor: marketingColors.surface } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${marketingColors.border}` }}>
          <ThemedLogo height={24} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={toggleMarketingTheme}
              sx={{ color: marketingColors.foreground }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: marketingColors.muted }} aria-label="Close menu">
              <Close />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ py: 1 }}>
          {megaMenus.map((menu) => (
            <React.Fragment key={menu.id}>
              <Box
                onClick={() => toggleMobileSubmenu(menu.id)}
                sx={{
                  py: 1.5,
                  px: 3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Typography sx={{ fontWeight: 500, color: marketingColors.foreground }}>
                  {menu.label}
                </Typography>
                {expandedMobileMenu === menu.id ? <ExpandLess sx={{ color: marketingColors.muted }} /> : <ExpandMore sx={{ color: marketingColors.muted }} />}
              </Box>
              <Collapse in={expandedMobileMenu === menu.id} timeout="auto" unmountOnExit>
                {menu.id === 'platform' && renderPlatformMenuMobile()}
                {menu.id === 'departments' && renderDepartmentsMenuMobile()}
                {menu.id === 'resources' && renderResourcesMenuMobile()}
                {menu.id === 'customers' && renderCustomersMenuMobile()}
                {menu.id === 'company' && renderCompanyMenuMobile()}
              </Collapse>
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ p: 3, borderTop: `1px solid ${marketingColors.border}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {utilityLinks.map((link) => (
              <Typography
                key={link.href}
                component="a"
                href={link.href}
                sx={{ fontSize: '0.875rem', color: marketingColors.muted, textDecoration: 'none', '&:hover': { color: marketingColors.accent }, WebkitTapHighlightColor: 'transparent' }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
          <Button
            variant="outlined"
            fullWidth
            disableRipple
            sx={{
              mt: 3,
              borderColor: marketingColors.accent,
              color: marketingColors.accent,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: colors.blurple800, bgcolor: marketingColors.hoverBg },
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Log in
          </Button>
        </Box>
      </Drawer >
    </>
  );
};

export default MarketingNavigation;
