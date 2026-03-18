/**
 * Property Lookup Page
 * Search public records by location (ESRI GIS) or record number
 * Claim and manage property records
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  MyLocation,
  Place,
  Description,
  CheckCircle,
  East,
  Close,
  PersonAdd,
  Home,
  Business,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import { cdsColors, cdsDesignTokens } from '../../../../theme/cds';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = cdsColors;
const theme = {
  ...cdsColors,
  primary: cdsColors.blurple700,
  primaryLight: cdsColors.blurple100,
  secondary: cdsColors.slate700,
  secondaryLight: cdsColors.slate100,
  success: cdsColors.green600,
  successLight: cdsColors.green50,
  warningLight: cdsColors.orange50,
};

// Mock public records data
const mockRecords = [
  { id: '25334', type: 'Building Permit Application', address: '123 Main Street, Boston, MA 02110', status: 'Active', owner: 'John Smith', date: 'Mar 15, 2025' },
  { id: '24926', type: 'Authorization for Out Of State Travel', address: '123 Main Street, Boston, MA 02110', status: 'Active', owner: null, date: 'Feb 28, 2025' },
  { id: '24501', type: 'Electrical Permit', address: '456 Oak Avenue, Boston, MA 02111', status: 'Completed', owner: 'Jane Doe', date: 'Jan 10, 2025' },
  { id: '24102', type: 'Plumbing Permit', address: '789 Elm Street, Cambridge, MA 02139', status: 'In Review', owner: null, date: 'Dec 5, 2024' },
  { id: '23887', type: 'Business License', address: '321 Commerce Blvd, Boston, MA 02110', status: 'Active', owner: 'ABC Corp', date: 'Nov 20, 2024' },
];

// Mock property data for map clicks
const mockProperties: Record<string, { address: string; owner: string; records: typeof mockRecords }> = {
  'default': {
    address: '123 Main Street, Boston, MA 02110',
    owner: 'Owner Unknown',
    records: mockRecords.filter(r => r.address.includes('123 Main')),
  },
};

const PropertyLookupPage: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchTab, setSearchTab] = useState<'location' | 'record'>('location');
  const [addressSearch, setAddressSearch] = useState('');
  const [recordSearch, setRecordSearch] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<typeof mockProperties['default'] | null>(null);
  const [detailTab, setDetailTab] = useState<'records' | 'details'>('records');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<typeof mockRecords[0] | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Initialize ESRI Map
  useEffect(() => {
    const loadEsriMap = async () => {
      try {
        // Load ESRI ArcGIS JS API from CDN
        const esriScript = document.createElement('script');
        esriScript.src = 'https://js.arcgis.com/4.28/';
        esriScript.async = true;
        
        const esriCss = document.createElement('link');
        esriCss.rel = 'stylesheet';
        esriCss.href = 'https://js.arcgis.com/4.28/esri/themes/light/main.css';
        
        document.head.appendChild(esriCss);
        document.head.appendChild(esriScript);

        esriScript.onload = () => {
          // @ts-ignore
          window.require(['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/layers/GraphicsLayer'], 
            (Map: any, MapView: any, Graphic: any, GraphicsLayer: any) => {
              if (!mapRef.current) return;

              const graphicsLayer = new GraphicsLayer();

              const map = new Map({
                basemap: 'streets-navigation-vector',
                layers: [graphicsLayer]
              });

              const view = new MapView({
                container: mapRef.current,
                map: map,
                center: [-71.0589, 42.3601], // Boston
                zoom: 13
              });

              // Add click handler
              view.on('click', (event: any) => {
                // Clear previous graphics
                graphicsLayer.removeAll();

                // Add marker at clicked location
                const point = {
                  type: 'point',
                  longitude: event.mapPoint.longitude,
                  latitude: event.mapPoint.latitude
                };

                const markerSymbol = {
                  type: 'simple-marker',
                  color: [0, 121, 193],
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  },
                  size: 12
                };

                const pointGraphic = new Graphic({
                  geometry: point,
                  symbol: markerSymbol
                });

                graphicsLayer.add(pointGraphic);

                // Simulate property lookup
                setIsSearching(true);
                setTimeout(() => {
                  setSelectedProperty(mockProperties['default']);
                  setIsSearching(false);
                }, 500);
              });

              view.when(() => {
                setIsMapLoaded(true);
              });
            }
          );
        };
      } catch (error) {
        console.error('Error loading ESRI map:', error);
        setIsMapLoaded(true); // Show fallback
      }
    };

    loadEsriMap();
  }, []);

  const handleAddressSearch = () => {
    if (!addressSearch) return;
    setIsSearching(true);
    // Simulate geocoding search
    setTimeout(() => {
      setSelectedProperty({
        address: addressSearch || '123 Main Street, Boston, MA 02110',
        owner: 'Owner Unknown',
        records: mockRecords.filter(r => r.address.toLowerCase().includes(addressSearch.toLowerCase().split(',')[0]) || addressSearch === ''),
      });
      setIsSearching(false);
    }, 800);
  };

  const handleRecordSearch = () => {
    if (!recordSearch) return;
    setIsSearching(true);
    // Simulate record search
    setTimeout(() => {
      const found = mockRecords.find(r => r.id === recordSearch);
      if (found) {
        setSelectedProperty({
          address: found.address,
          owner: found.owner || 'Owner Unknown',
          records: [found],
        });
      } else {
        setSelectedProperty(null);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleClaimRecord = (record: typeof mockRecords[0]) => {
    setSelectedRecord(record);
    setClaimDialogOpen(true);
  };

  const confirmClaim = () => {
    // Simulate claim process
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimDialogOpen(false);
      setClaimSuccess(false);
      // Update the record with claimed status
      if (selectedProperty && selectedRecord) {
        const updatedRecords = selectedProperty.records.map(r => 
          r.id === selectedRecord.id ? { ...r, owner: 'You (Claimed)' } : r
        );
        setSelectedProperty({ ...selectedProperty, records: updatedRecords });
      }
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.gray50 }}>
      {/* Navigation */}
      <PortalNavigation />

      {/* Header */}
      <Box sx={{ bgcolor: theme.white, borderBottom: `1px solid ${theme.gray200}` }}>
        <Box sx={{ maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: 4, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate('/unified-portal/permits')} sx={{ color: theme.gray500 }}>
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: theme.gray900 }}>
                  Property & Record Lookup
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: theme.gray500 }}>
                  Search public records by location or record number
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button sx={{ textTransform: 'none', fontWeight: 500, color: theme.gray600 }}>My Account</Button>
              <Button sx={{ textTransform: 'none', fontWeight: 500, color: theme.gray600 }}>Search</Button>
              <Chip 
                avatar={<Box sx={{ width: 24, height: 24, borderRadius: '4px', bgcolor: theme.primary, color: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 600 }}>GC</Box>}
                label="Gabriela"
                sx={{ bgcolor: theme.white, border: `1px solid ${theme.gray200}` }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', height: 'calc(100vh - 130px)' }}>
        {/* Map Area */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          {/* Map Container */}
          <Box 
            ref={mapRef} 
            sx={{ 
              width: '100%', 
              height: '100%',
              bgcolor: theme.gray100,
            }}
          />
          
          {/* Map Loading Overlay */}
          {!isMapLoaded && (
            <Box sx={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: theme.gray100,
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: theme.primary, mb: 2 }} />
                <Typography sx={{ color: theme.gray500 }}>Loading map...</Typography>
              </Box>
            </Box>
          )}

          {/* Search Overlay */}
          <Card 
            elevation={2} 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              left: 16, 
              width: 380,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Search Tabs */}
            <Box sx={{ borderBottom: `1px solid ${theme.gray200}` }}>
              <Tabs 
                value={searchTab} 
                onChange={(_, v) => setSearchTab(v)}
                sx={{ minHeight: 44 }}
              >
                <Tab 
                  value="location" 
                  label="Search by Location" 
                  icon={<Place sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontSize: '0.8125rem', minHeight: 44, flex: 1 }}
                />
                <Tab 
                  value="record" 
                  label="Search by Record #" 
                  icon={<Description sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontSize: '0.8125rem', minHeight: 44, flex: 1 }}
                />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 2 }}>
              {searchTab === 'location' ? (
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter address, city, or zip code..."
                    value={addressSearch}
                    onChange={(e) => setAddressSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ fontSize: 20, color: theme.gray400 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" sx={{ color: theme.primary }} title="Use my location">
                              <MyLocation sx={{ fontSize: 18 }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                      mb: 1.5,
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddressSearch}
                    disabled={isSearching}
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600, 
                      bgcolor: theme.primary,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: colors.blurple600 },
                    }}
                  >
                    {isSearching ? <CircularProgress size={20} sx={{ color: theme.white }} /> : 'Search Property'}
                  </Button>
                  <Typography sx={{ fontSize: '0.6875rem', color: theme.gray400, mt: 1.5, textAlign: 'center' }}>
                    Or click anywhere on the map to lookup property records
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter record number (e.g., 25334)..."
                    value={recordSearch}
                    onChange={(e) => setRecordSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRecordSearch()}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ fontSize: 20, color: theme.gray400 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                      mb: 1.5,
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRecordSearch}
                    disabled={isSearching}
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600, 
                      bgcolor: theme.primary,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: colors.blurple600 },
                    }}
                  >
                    {isSearching ? <CircularProgress size={20} sx={{ color: theme.white }} /> : 'Find Record'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Map Attribution */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            bgcolor: 'rgba(255,255,255,0.9)',
            px: 2,
            py: 0.5,
            fontSize: '0.625rem',
            color: theme.gray500,
          }}>
            Esri, City of Cambridge, Esri, TomTom, Garmin, SafeGraph, GeoTechnologies, Inc, METI/NASA, USGS, EPA, NPS, USDA, USFWS
          </Box>
        </Box>

        {/* Property Details Panel */}
        {selectedProperty && (
          <Box sx={{ width: 480, borderLeft: `1px solid ${theme.gray200}`, bgcolor: theme.white, overflowY: 'auto' }}>
            {/* Property Header */}
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.gray200}` }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.gray900, mb: 1 }}>
                    {selectedProperty.address}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedProperty(null)}>
                  <Close sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Property Owner Card */}
            <Box sx={{ px: 3, py: 2 }}>
              <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${theme.gray200}` }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: theme.gray500, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Property Owner
                  </Typography>
                  <Typography sx={{ fontSize: '0.9375rem', color: theme.gray700 }}>
                    {selectedProperty.owner}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Records/Details Tabs */}
            <Box sx={{ px: 3 }}>
              <Tabs 
                value={detailTab} 
                onChange={(_, v) => setDetailTab(v)}
                sx={{ borderBottom: `1px solid ${theme.gray200}` }}
              >
                <Tab value="records" label="Records" sx={{ textTransform: 'none', fontWeight: 600 }} />
                <Tab value="details" label="Details" sx={{ textTransform: 'none', fontWeight: 600 }} />
              </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3 }}>
              {detailTab === 'records' ? (
                <Box>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: theme.gray900, mb: 2 }}>
                    Records
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, color: theme.gray700, fontSize: '0.8125rem' }}>Record #</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: theme.gray700, fontSize: '0.8125rem' }}>Record Type</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: theme.gray700, fontSize: '0.8125rem', textAlign: 'right' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedProperty.records.length > 0 ? (
                          selectedProperty.records.map((record) => (
                            <TableRow 
                              key={record.id} 
                              hover 
                              sx={{ cursor: 'pointer' }}
                              onClick={() => !record.owner && handleClaimRecord(record)}
                            >
                              <TableCell sx={{ fontSize: '0.8125rem', color: theme.gray900 }}>{record.id}</TableCell>
                              <TableCell>
                                <Box>
                                  <Typography sx={{ fontSize: '0.8125rem', color: theme.gray900 }}>{record.type}</Typography>
                                  {!record.owner && (
                                    <Chip
                                      size="small"
                                      icon={<PersonAdd sx={{ fontSize: 12 }} />}
                                      label="Claim this record"
                                      sx={{ 
                                        height: 20, 
                                        mt: 0.5,
                                        fontSize: '0.625rem', 
                                        bgcolor: theme.secondaryLight, 
                                        color: theme.secondary,
                                        '& .MuiChip-icon': { color: theme.secondary },
                                        cursor: 'pointer',
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClaimRecord(record);
                                      }}
                                    />
                                  )}
                                  {record.owner && (
                                    <Typography sx={{ fontSize: '0.6875rem', color: theme.gray400, mt: 0.25 }}>
                                      Owner: {record.owner}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ textAlign: 'right' }}>
                                <Chip
                                  label={record.status}
                                  size="small"
                                  sx={{ 
                                    height: 22,
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    bgcolor: record.status === 'Active' ? theme.primaryLight : record.status === 'Completed' ? theme.successLight : theme.warningLight,
                                    color: record.status === 'Active' ? theme.primary : record.status === 'Completed' ? theme.success : theme.warning,
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                              <Typography sx={{ color: theme.gray500, fontSize: '0.875rem' }}>
                                No records found for this property
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: theme.gray900, mb: 2 }}>
                    Property Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: theme.gray500, mb: 0.5 }}>Address</Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: theme.gray900 }}>{selectedProperty.address}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: theme.gray500, mb: 0.5 }}>Property Type</Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: theme.gray900 }}>Residential</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: theme.gray500, mb: 0.5 }}>Zoning</Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: theme.gray900 }}>R-1 (Single Family Residential)</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: theme.gray500, mb: 0.5 }}>Lot Size</Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: theme.gray900 }}>5,200 sq ft</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: theme.gray500, mb: 0.5 }}>Year Built</Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: theme.gray900 }}>1952</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Claim Record Dialog */}
      <Dialog 
        open={claimDialogOpen} 
        onClose={() => !claimSuccess && setClaimDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '4px' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: theme.secondaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonAdd sx={{ color: theme.secondary }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600 }}>Claim This Record</Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: theme.gray500 }}>Record #{selectedRecord?.id}</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {claimSuccess ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: theme.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 32, color: theme.success }} />
              </Box>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.gray900, mb: 1 }}>
                Record Claimed Successfully!
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: theme.gray500 }}>
                This record has been linked to your account.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
                By claiming this record, you confirm that you are the property owner or authorized representative.
              </Alert>
              
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: theme.gray700, mb: 1 }}>Record Details</Typography>
                <Card elevation={0} sx={{ bgcolor: theme.gray50, borderRadius: '8px' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontSize: '0.8125rem', color: theme.gray500 }}>Type</Typography>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: theme.gray900 }}>{selectedRecord?.type}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontSize: '0.8125rem', color: theme.gray500 }}>Address</Typography>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: theme.gray900 }}>{selectedRecord?.address}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.8125rem', color: theme.gray500 }}>Date</Typography>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: theme.gray900 }}>{selectedRecord?.date}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              <Typography sx={{ fontSize: '0.75rem', color: theme.gray500, lineHeight: 1.5 }}>
                Once claimed, you'll be able to manage this record, receive notifications about updates, 
                and access related documents through your account.
              </Typography>
            </Box>
          )}
        </DialogContent>
        {!claimSuccess && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setClaimDialogOpen(false)}
              sx={{ textTransform: 'none', color: theme.gray600 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={confirmClaim}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                bgcolor: theme.secondary,
                '&:hover': { bgcolor: colors.blurple600 },
              }}
            >
              Confirm & Claim Record
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default PropertyLookupPage;

