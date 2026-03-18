/**
 * Common page layout styles
 * These are reusable style objects for common page patterns
 */

export const pageStyles = {
  // List view pages
  listView: {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'background.default',
      overflow: 'hidden'
    },
    contentArea: {
      flex: 1,
      backgroundColor: 'background.secondary',
      overflow: 'auto'
    },
    contentWrapper: {
      px: 3,
      py: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    tableContainer: {
      flex: 1,
      minHeight: 0
    }
  },

  // Form/Edit pages
  formView: {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 92px)',  // PlatformNav (48px) + NavBar (44px)
      backgroundColor: 'background.default'
    },
    mainContainer: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      p: 3,
      gap: 2
    },
    contentArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      // backgroundColor: 'background.secondary'
    },
    formSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minHeight: 0,
      mt: 2
    },
    toolbarSection: {
      mb: 2
    },
    actionBar: {
      mt: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 2
    },
    sidePanel: {
      width: 320,
      borderLeft: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      p: 3,
      overflowY: 'auto'
    }
  },

  // Detail view pages
  detailView: {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 92px)',  // PlatformNav (48px) + NavBar (44px)
      backgroundColor: 'background.default'
    },
    tabContainer: {
      borderBottom: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper'
    },
    contentArea: {
      flex: 1,
      overflow: 'auto',
      p: 3,
      backgroundColor: 'background.secondary'
    },
    sectionPaper: {
      p: 3,
      mb: 3
    },
    gridSpacing: 3,
    metricCard: {
      p: 2,
      height: '100%'
    }
  }
};

// Helper function for chip styles based on status
export const getStatusChipStyle = (status: string) => {
  const statusColors: Record<string, any> = {
    active: {
      backgroundColor: 'success.light',
      color: 'success.dark'
    },
    inactive: {
      backgroundColor: 'grey.200',
      color: 'grey.700'
    },
    published: {
      backgroundColor: 'success.light',
      color: 'success.dark'
    },
    draft: {
      backgroundColor: 'grey.200',
      color: 'grey.700'
    },
    deprecated: {
      backgroundColor: 'warning.light',
      color: 'warning.dark'
    }
  };

  return statusColors[status] || statusColors.inactive;
};