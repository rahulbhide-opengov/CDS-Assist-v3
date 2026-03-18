/**
 * Themes Showcase Page
 *
 * Displays all UI components to visualize the current theme application
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  Grid,
  Divider,
  Stack,
  IconButton,
  ButtonGroup,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  ClickAwayListener,
  Grow,
  Popper,
  MenuList,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Send as SendIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { SeamstressLayout } from '../../components/SeamstressLayout';
import { useThemeEditor } from '../../hooks/useThemeEditor';

export default function ThemesPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectValue, setSelectValue] = React.useState('option1');
  const { savedThemes, activeThemeId, applyTheme } = useThemeEditor();

  // Split button state
  const [splitButton1Open, setSplitButton1Open] = React.useState(false);
  const [splitButton2Open, setSplitButton2Open] = React.useState(false);
  const splitButton1Ref = React.useRef<HTMLDivElement>(null);
  const splitButton2Ref = React.useRef<HTMLDivElement>(null);
  const [selectedIndex1, setSelectedIndex1] = React.useState(0);
  const [selectedIndex2, setSelectedIndex2] = React.useState(0);

  const options1 = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];
  const options2 = ['Save', 'Save and close', 'Save and create new'];

  const handleThemeChange = (event: any) => {
    const themeId = event.target.value;
    applyTheme(themeId === 'default' ? null : themeId);
  };

  return (
    <SeamstressLayout maxContentWidth="none">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Theme Showcase
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Visual demonstration of all UI components with the current theme application
          </Typography>

          {/* Theme Selector */}
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Theme</InputLabel>
              <Select
                value={activeThemeId || 'default'}
                onChange={handleThemeChange}
                label="Select Theme"
              >
                <MenuItem value="default">Default Theme</MenuItem>
                {savedThemes.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    {theme.name} ({theme.mode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Box>

        {/* Typography Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Typography
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            <Typography variant="h1">Heading 1 (h1)</Typography>
            <Typography variant="h2">Heading 2 (h2)</Typography>
            <Typography variant="h3">Heading 3 (h3)</Typography>
            <Typography variant="h4">Heading 4 (h4)</Typography>
            <Typography variant="h5">Heading 5 (h5)</Typography>
            <Typography variant="h6">Heading 6 (h6)</Typography>
            <Typography variant="body1">
              Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
            <Typography variant="body2">
              Body 2 - Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Typography variant="caption" display="block">
              Caption - Duis aute irure dolor in reprehenderit
            </Typography>
            <Typography variant="overline" display="block">
              Overline Text
            </Typography>
          </Stack>
        </Paper>

        {/* Buttons Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Buttons
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Contained Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contained Buttons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button variant="contained">Default</Button>
              <Button variant="contained" color="primary">Primary</Button>
              <Button variant="contained" color="secondary">Secondary</Button>
              <Button variant="contained" color="success">Success</Button>
              <Button variant="contained" color="error">Error</Button>
              <Button variant="contained" color="warning">Warning</Button>
              <Button variant="contained" color="info">Info</Button>
              <Button variant="contained" disabled>Disabled</Button>
            </Stack>
          </Box>

          {/* Outlined Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Outlined Buttons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button variant="outlined">Default</Button>
              <Button variant="outlined" color="primary">Primary</Button>
              <Button variant="outlined" color="secondary">Secondary</Button>
              <Button variant="outlined" color="success">Success</Button>
              <Button variant="outlined" color="error">Error</Button>
              <Button variant="outlined" color="warning">Warning</Button>
              <Button variant="outlined" color="info">Info</Button>
              <Button variant="outlined" disabled>Disabled</Button>
            </Stack>
          </Box>

          {/* Text Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Text Buttons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button>Default</Button>
              <Button color="primary">Primary</Button>
              <Button color="secondary">Secondary</Button>
              <Button color="success">Success</Button>
              <Button color="error">Error</Button>
              <Button color="warning">Warning</Button>
              <Button color="info">Info</Button>
              <Button disabled>Disabled</Button>
            </Stack>
          </Box>

          {/* Buttons with Icons */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Buttons with Icons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button variant="contained" startIcon={<SendIcon />}>
                Send
              </Button>
              <Button variant="outlined" startIcon={<DeleteIcon />}>
                Delete
              </Button>
              <Button variant="contained" color="error" endIcon={<DeleteIcon />}>
                Remove
              </Button>
            </Stack>
          </Box>

          {/* Icon Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Icon Buttons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <IconButton><FavoriteIcon /></IconButton>
              <IconButton color="primary"><FavoriteIcon /></IconButton>
              <IconButton color="secondary"><StarIcon /></IconButton>
              <IconButton color="error"><DeleteIcon /></IconButton>
              <IconButton disabled><DeleteIcon /></IconButton>
            </Stack>
          </Box>

          {/* Split Buttons */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Split Buttons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {/* Contained Split Button */}
              <React.Fragment>
                <ButtonGroup variant="contained" ref={splitButton1Ref}>
                  <Button onClick={() => console.log(options1[selectedIndex1])}>
                    {options1[selectedIndex1]}
                  </Button>
                  <Button
                    onClick={() => setSplitButton1Open((prev) => !prev)}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>
                <Popper
                  open={splitButton1Open}
                  anchorEl={splitButton1Ref.current}
                  role={undefined}
                  transition
                  disablePortal
                  style={{ zIndex: 1 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                      <Paper elevation={0}>
                        <ClickAwayListener onClickAway={() => setSplitButton1Open(false)}>
                          <MenuList>
                            {options1.map((option, index) => (
                              <MenuItem
                                key={option}
                                selected={index === selectedIndex1}
                                onClick={() => {
                                  setSelectedIndex1(index);
                                  setSplitButton1Open(false);
                                }}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </React.Fragment>

              {/* Outlined Split Button */}
              <React.Fragment>
                <ButtonGroup variant="outlined" color="primary" ref={splitButton2Ref}>
                  <Button onClick={() => console.log(options2[selectedIndex2])}>
                    {options2[selectedIndex2]}
                  </Button>
                  <Button
                    onClick={() => setSplitButton2Open((prev) => !prev)}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>
                <Popper
                  open={splitButton2Open}
                  anchorEl={splitButton2Ref.current}
                  role={undefined}
                  transition
                  disablePortal
                  style={{ zIndex: 1 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                      <Paper elevation={0}>
                        <ClickAwayListener onClickAway={() => setSplitButton2Open(false)}>
                          <MenuList>
                            {options2.map((option, index) => (
                              <MenuItem
                                key={option}
                                selected={index === selectedIndex2}
                                onClick={() => {
                                  setSelectedIndex2(index);
                                  setSplitButton2Open(false);
                                }}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </React.Fragment>
            </Stack>
          </Box>
        </Paper>

        {/* Chips Section - MUI Standard Colors */}
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Chips
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Standard Colors */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filled Variant
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label="Default" />
              <Chip label="Primary" color="primary" />
              <Chip label="Secondary" color="secondary" />
              <Chip label="Success" color="success" />
              <Chip label="Error" color="error" />
              <Chip label="Warning" color="warning" />
              <Chip label="Info" color="info" />
            </Stack>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Outlined Variant
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label="Default" variant="outlined" />
              <Chip label="Primary" color="primary" variant="outlined" />
              <Chip label="Secondary" color="secondary" variant="outlined" />
              <Chip label="Success" color="success" variant="outlined" />
              <Chip label="Error" color="error" variant="outlined" />
              <Chip label="Warning" color="warning" variant="outlined" />
              <Chip label="Info" color="info" variant="outlined" />
            </Stack>
          </Box>


          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Strong Variant
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label="Default" variant="strong" />
              <Chip label="Success" color="success" variant="strong" />
              <Chip label="Error" color="error" variant="strong" />
              <Chip label="Warning" color="warning" variant="strong" />
              <Chip label="Info" color="info" variant="strong" />
            </Stack>
          </Box>


          {/* Size Variants */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Size Variants
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label="Small" color="success" size="small" />
              <Chip label="Medium" color="success" />
            </Stack>
          </Box>

          {/* With Icons */}
          <Box>
            <Typography variant="h6" gutterBottom>
              With Icons and Actions
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label="With Icon" color="primary" icon={<NotificationsIcon />} />
              <Chip label="With Avatar" color="secondary" avatar={<Avatar>OG</Avatar>} />
              <Chip label="Deletable" color="error" onDelete={() => {}} deleteIcon={<CancelIcon />} />
              <Chip label="Clickable" color="info" onClick={() => console.log('clicked')} />
            </Stack>
          </Box>
        </Paper>

        {/* Text Inputs Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Text Inputs
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>

            {/* Outlined Inputs */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Outlined Variant
              </Typography>
              <Stack spacing={2}>
                <TextField label="Default" variant="outlined" />
                <TextField label="Required" variant="outlined" required />
                <TextField label="Disabled" variant="outlined" disabled />
                <TextField label="Error" variant="outlined" error helperText="This field has an error" />
                <TextField
                  label="With Icon"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><FavoriteIcon /></InputAdornment>,
                    },
                  }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Form Controls Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Form Controls
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Switches */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Switches
              </Typography>
              <Stack spacing={1}>
                <FormControlLabel control={<Switch defaultChecked />} label="Checked" />
                <FormControlLabel control={<Switch />} label="Unchecked" />
                <FormControlLabel control={<Switch color="secondary" defaultChecked />} label="Secondary" />
                <FormControlLabel control={<Switch color="success" defaultChecked />} label="Success" />
                <FormControlLabel control={<Switch disabled />} label="Disabled" />
              </Stack>
            </Grid>

            {/* Checkboxes */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Checkboxes
              </Typography>
              <Stack spacing={1}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
                <FormControlLabel control={<Checkbox />} label="Unchecked" />
                <FormControlLabel control={<Checkbox color="secondary" defaultChecked />} label="Secondary" />
                <FormControlLabel control={<Checkbox color="success" defaultChecked />} label="Success" />
                <FormControlLabel control={<Checkbox disabled />} label="Disabled" />
              </Stack>
            </Grid>

            {/* Radio Buttons */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl>
                <FormLabel>Radio Buttons</FormLabel>
                <RadioGroup defaultValue="option1">
                  <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                  <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                  <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
                  <FormControlLabel value="disabled" control={<Radio />} label="Disabled" disabled />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Select */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Input</InputLabel>
                <Select
                  value={selectValue}
                  label="Select Input"
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                  <MenuItem value="option4">Option 4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Table Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Table
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox defaultChecked />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Item One</TableCell>
                  <TableCell>Category A</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="success">
                      Active
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell padding="checkbox">
                    <Checkbox defaultChecked />
                  </TableCell>
                  <TableCell>Item Two</TableCell>
                  <TableCell>Category B</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="warning">
                      Pending
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Item Three</TableCell>
                  <TableCell>Category C</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="error">
                      Inactive
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Item Four</TableCell>
                  <TableCell>Category D</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="info">
                      Processing
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow hover selected>
                  <TableCell padding="checkbox">
                    <Checkbox defaultChecked />
                  </TableCell>
                  <TableCell>Item Five (Selected Row)</TableCell>
                  <TableCell>Category E</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary">
                      Selected
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Color Palette Display */}
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Color Palette
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Primary</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'secondary.main',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Secondary</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'success.main',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Success</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'error.main',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Error</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'warning.main',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Warning</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'info.main',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Info</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Background Paper</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1
                }} />
                <Typography variant="body2">Background Default</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </SeamstressLayout>
  );
}
