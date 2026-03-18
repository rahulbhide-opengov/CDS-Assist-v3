/**
 * GitHubSignIn
 *
 * Form for users to sign in with their GitHub Personal Access Token.
 * Validates the token and stores it in localStorage.
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Avatar,
  Stack,
} from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
import {
  validateGitHubToken,
  setUserGitHubToken,
  clearUserGitHubToken,
  type GitHubUser,
} from '../../services/github';

interface GitHubSignInProps {
  onSignIn: () => void;
  currentUser?: GitHubUser | null;
}

export const GitHubSignIn: React.FC<GitHubSignInProps> = ({
  onSignIn,
  currentUser,
}) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await validateGitHubToken(token.trim());
      setUserGitHubToken(token.trim());
      setToken('');
      onSignIn();
    } catch (err) {
      setError('Invalid token. Please check your token and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    clearUserGitHubToken();
    onSignIn(); // Refresh state
  };

  if (currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={currentUser.avatar_url}
            alt={currentUser.login}
            sx={{ width: 48, height: 48 }}
          />
          <Typography variant="body2">
            Signed in as <strong>{currentUser.login}</strong>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} alignItems="center">
        <GitHubIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
        <Typography variant="body1" fontWeight={500} textAlign="center">
          Sign in to comment
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Enter a GitHub Personal Access Token to view and post comments.
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          size="small"
          type="password"
          label="Personal Access Token"
          placeholder="ghp_xxxxxxxxxxxx"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={isLoading}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={!token.trim() || isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <GitHubIcon />}
        >
          {isLoading ? 'Verifying...' : 'Sign in with GitHub'}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          Need a token?{' '}
          <Link
            href="https://github.com/settings/tokens/new?scopes=repo&description=Seamstress%20Design%20Comments"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create one here
          </Link>
          {' '}with <code>repo</code> scope.
        </Typography>
      </Alert>
    </Box>
  );
};
