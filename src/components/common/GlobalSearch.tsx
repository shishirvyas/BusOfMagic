import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  Divider,
  Paper,
} from '@mui/material'
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import apiClient from '@/services/api'

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

interface SearchResult {
  id: number | string
  type: 'candidate' | 'customer' | 'location' | 'page'
  title: string
  subtitle?: string
  path: string
}

// Quick navigation pages
const quickPages: SearchResult[] = [
  { id: 'dashboard', type: 'page', title: 'Dashboard', subtitle: 'View statistics and trends', path: '/dashboard' },
  { id: 'screening', type: 'page', title: 'Under Screening', subtitle: 'Manage candidate screenings', path: '/under-screening' },
  { id: 'orientation', type: 'page', title: 'Orientation', subtitle: 'Orientation pending candidates', path: '/orientation' },
  { id: 'enroll', type: 'page', title: 'Enroll', subtitle: 'Enroll candidates', path: '/enroll' },
  { id: 'reports', type: 'page', title: 'Reports', subtitle: 'View and export reports', path: '/reports' },
  { id: 'notifications', type: 'page', title: 'Notifications', subtitle: 'View aging alerts', path: '/notifications' },
  { id: 'training', type: 'page', title: 'Training Calendar', subtitle: 'Manage training batches', path: '/training-calendar' },
  { id: 'customers', type: 'page', title: 'Customers', subtitle: 'Manage customers', path: '/customers' },
  { id: 'locations', type: 'page', title: 'Locations', subtitle: 'Manage locations', path: '/locations' },
  { id: 'settings', type: 'page', title: 'Settings', subtitle: 'Application settings', path: '/settings' },
]

const typeIcons: Record<string, React.ReactNode> = {
  candidate: <PersonIcon />,
  customer: <BusinessIcon />,
  location: <LocationIcon />,
  page: <DashboardIcon />,
}

const typeColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  candidate: 'primary',
  customer: 'secondary',
  location: 'success',
  page: 'info',
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Search function with debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const searchResults: SearchResult[] = []

    try {
      // Search pages first (instant)
      const matchingPages = quickPages.filter(
        page =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      searchResults.push(...matchingPages)

      // Search candidates from API
      try {
        const candidateResponse = await apiClient.get(`/candidates/search?query=${encodeURIComponent(searchQuery)}`)
        if (candidateResponse.data && Array.isArray(candidateResponse.data)) {
          const candidates = candidateResponse.data.slice(0, 5).map((c: any) => ({
            id: c.id,
            type: 'candidate' as const,
            title: `${c.firstName} ${c.lastName}`,
            subtitle: c.phone || c.email,
            path: `/under-screening?id=${c.id}`,
          }))
          searchResults.push(...candidates)
        }
      } catch {
        // Ignore candidate search errors
      }

      // Search customers from API
      try {
        const customerResponse = await apiClient.get(`/customers?search=${encodeURIComponent(searchQuery)}`)
        if (customerResponse.data && Array.isArray(customerResponse.data)) {
          const customers = customerResponse.data.slice(0, 3).map((c: any) => ({
            id: c.id,
            type: 'customer' as const,
            title: c.name,
            subtitle: c.contactPerson,
            path: `/customers?id=${c.id}`,
          }))
          searchResults.push(...customers)
        }
      } catch {
        // Ignore customer search errors
      }

    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setResults(searchResults)
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updatedRecent)
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent))

    navigate(result.path)
    onClose()
    setQuery('')
  }

  const handleClose = () => {
    onClose()
    setQuery('')
    setResults([])
  }

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (!open) {
          // This would need to be handled by parent component
        }
      }
      if (e.key === 'Escape' && open) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          position: 'fixed',
          top: '15%',
          m: 0,
          borderRadius: 2,
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search Input */}
        <TextField
          autoFocus
          fullWidth
          placeholder="Search candidates, pages, or type a command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
            sx: { 
              py: 1.5,
              px: 2,
              '& fieldset': { border: 'none' }
            }
          }}
        />
        
        <Divider />

        {/* Results */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {!query && (
            <Box sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                QUICK NAVIGATION
              </Typography>
              <List dense>
                {quickPages.slice(0, 6).map((page) => (
                  <ListItemButton
                    key={page.id}
                    onClick={() => handleSelect(page)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {typeIcons[page.type]}
                    </ListItemIcon>
                    <ListItemText
                      primary={page.title}
                      secondary={page.subtitle}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <Chip
                      label={page.type}
                      size="small"
                      color={typeColors[page.type]}
                      variant="outlined"
                    />
                  </ListItemButton>
                ))}
              </List>
              
              {recentSearches.length > 0 && (
                <>
                  <Typography variant="caption" color="text.secondary" sx={{ px: 1, mt: 2, display: 'block' }}>
                    RECENT SEARCHES
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 1 }}>
                    {recentSearches.map((search, idx) => (
                      <Chip
                        key={idx}
                        label={search}
                        size="small"
                        onClick={() => setQuery(search)}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )}

          {query && results.length > 0 && (
            <List>
              {results.map((result) => (
                <ListItemButton
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  sx={{ px: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {typeIcons[result.type]}
                  </ListItemIcon>
                  <ListItemText
                    primary={result.title}
                    secondary={result.subtitle}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Chip
                    label={result.type}
                    size="small"
                    color={typeColors[result.type]}
                    variant="outlined"
                  />
                </ListItemButton>
              ))}
            </List>
          )}

          {query && results.length === 0 && !loading && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No results found for "{query}"
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer hint */}
        <Divider />
        <Box sx={{ p: 1.5, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Press <kbd style={{ backgroundColor: '#e0e0e0', padding: '2px 6px', borderRadius: 4 }}>↵</kbd> to select
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <kbd style={{ backgroundColor: '#e0e0e0', padding: '2px 6px', borderRadius: 4 }}>Esc</kbd> to close
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
