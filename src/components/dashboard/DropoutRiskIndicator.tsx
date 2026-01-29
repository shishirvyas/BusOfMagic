import { Box, Typography, LinearProgress, Tooltip, Chip, Paper } from '@mui/material'
import {
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

interface DropoutRiskProps {
  totalCandidates: number
  enrolled: number
  dropped: number
  pendingScreening: number
  pendingOrientation: number
  pendingEnroll: number
  compact?: boolean
}

interface RiskLevel {
  level: 'low' | 'medium' | 'high'
  color: 'success' | 'warning' | 'error'
  icon: React.ReactNode
  message: string
}

/**
 * Calculate dropout risk based on various factors
 * - High pending counts = higher risk
 * - High dropout rate = higher risk
 * - Low enrollment rate = higher risk
 */
function calculateDropoutRisk(props: DropoutRiskProps): { score: number; risk: RiskLevel } {
  const { totalCandidates, enrolled, dropped, pendingScreening, pendingOrientation, pendingEnroll } = props

  if (totalCandidates === 0) {
    return {
      score: 0,
      risk: {
        level: 'low',
        color: 'success',
        icon: <CheckCircleIcon />,
        message: 'No candidates to evaluate',
      },
    }
  }

  // Calculate various risk factors
  const dropoutRate = (dropped / totalCandidates) * 100
  const enrollmentRate = (enrolled / totalCandidates) * 100
  const pendingTotal = pendingScreening + pendingOrientation + pendingEnroll
  const pendingRate = (pendingTotal / totalCandidates) * 100

  // Risk score calculation (0-100)
  let riskScore = 0

  // Dropout rate contribution (max 40 points)
  if (dropoutRate > 20) riskScore += 40
  else if (dropoutRate > 10) riskScore += 25
  else if (dropoutRate > 5) riskScore += 15
  else riskScore += dropoutRate * 2

  // Low enrollment contribution (max 30 points)
  if (enrollmentRate < 20) riskScore += 30
  else if (enrollmentRate < 40) riskScore += 20
  else if (enrollmentRate < 60) riskScore += 10

  // High pending contribution (max 30 points)
  if (pendingRate > 50) riskScore += 30
  else if (pendingRate > 30) riskScore += 20
  else if (pendingRate > 15) riskScore += 10

  // Determine risk level
  let risk: RiskLevel
  if (riskScore >= 60) {
    risk = {
      level: 'high',
      color: 'error',
      icon: <WarningIcon />,
      message: 'High dropout risk! Immediate attention needed.',
    }
  } else if (riskScore >= 35) {
    risk = {
      level: 'medium',
      color: 'warning',
      icon: <TrendingDownIcon />,
      message: 'Moderate risk. Monitor pending candidates closely.',
    }
  } else {
    risk = {
      level: 'low',
      color: 'success',
      icon: <CheckCircleIcon />,
      message: 'Low dropout risk. Keep up the good work!',
    }
  }

  return { score: Math.min(100, riskScore), risk }
}

export default function DropoutRiskIndicator(props: DropoutRiskProps) {
  const { compact = false } = props
  const { score, risk } = calculateDropoutRisk(props)

  if (compact) {
    return (
      <Tooltip title={risk.message}>
        <Chip
          icon={risk.icon as React.ReactElement}
          label={`${risk.level.toUpperCase()} RISK`}
          color={risk.color}
          size="small"
          variant="outlined"
        />
      </Tooltip>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ color: `${risk.color}.main` }}>{risk.icon}</Box>
        <Typography variant="subtitle1" fontWeight="bold">
          Dropout Risk Indicator
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={score}
            color={risk.color}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
        <Typography variant="body2" fontWeight="bold" color={`${risk.color}.main`}>
          {score.toFixed(0)}%
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {risk.message}
        </Typography>
        <Chip
          label={risk.level.toUpperCase()}
          color={risk.color}
          size="small"
        />
      </Box>

      {/* Risk factors breakdown */}
      <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Risk Factors:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
          <Chip
            label={`Dropout: ${props.dropped}`}
            size="small"
            color={props.dropped > 5 ? 'error' : 'default'}
            variant="outlined"
          />
          <Chip
            label={`Pending: ${props.pendingScreening + props.pendingOrientation + props.pendingEnroll}`}
            size="small"
            color={props.pendingScreening + props.pendingOrientation + props.pendingEnroll > 10 ? 'warning' : 'default'}
            variant="outlined"
          />
          <Chip
            label={`Enrolled: ${props.enrolled}`}
            size="small"
            color={props.enrolled > 0 ? 'success' : 'default'}
            variant="outlined"
          />
        </Box>
      </Box>
    </Paper>
  )
}

// Also export the calculation function for use elsewhere
export { calculateDropoutRisk }
