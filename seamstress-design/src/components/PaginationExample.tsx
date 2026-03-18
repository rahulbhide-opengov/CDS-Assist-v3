import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Pagination } from '@opengov/components-pagination';
import { Result } from '@opengov/components-result';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  date: Date;
}

// Generate mock data
const generateMockData = (count: number): Item[] => {
  const categories = ['Finance', 'Operations', 'HR', 'IT', 'Legal'];
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    name: `Item ${index + 1}`,
    description: `This is a description for item ${index + 1}. It contains relevant information about the item.`,
    category: categories[Math.floor(Math.random() * categories.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }));
};

export const PaginationExample: React.FC = () => {
  const allItems = generateMockData(147); // Total items
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter items
  const filteredItems = filterCategory === 'all'
    ? allItems
    : allItems.filter(item => item.category === filterCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pagination Example
      </Typography>

      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            label="Category"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="Operations">Operations</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="Legal">Legal</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={itemsPerPage}
            label="Items per page"
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Results summary */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
      </Typography>

      {/* Content */}
      {currentItems.length > 0 ? (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <List>
                {currentItems.map((item, index) => (
                  <ListItem
                    key={item.id}
                    divider={index < currentItems.length - 1}
                    sx={{ py: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1">{item.name}</Typography>
                          <Chip label={item.category} size="small" />
                        </Stack>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.date.toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Pagination component from OpenGov */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            '& .MuiScopedCssBaseline-root': {
              width: '100%'
            }
          }}>
            <Pagination
              count={filteredItems.length}
              page={currentPage}
              onChange={(e, page) => handlePageChange(page)}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPage={false}
              showItemCount={true}
              siblingCount={2}
              boundaryCount={1}
            />
          </Box>
        </>
      ) : (
        <Result
          status="empty"
          title="No items found"
          description="Try adjusting your filters"
        />
      )}
    </Box>
  );
};

export default PaginationExample;