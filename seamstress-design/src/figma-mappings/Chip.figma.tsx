/**
 * Figma Code Connect mapping for MUI Chip
 *
 * This file maps Figma Chip components to MUI Chip components.
 */

import { figma } from '@figma/code-connect'
import { Chip } from '@mui/material'

// Map MUI Chip to Figma Chip component
// Node ID: 14866:116829 (Chip example)
figma.connect(Chip, 'https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37?node-id=14866-116829', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      'Filled': 'filled',
      'Outlined': 'outlined',
    }),
    color: figma.enum('Color', {
      'Default': 'default',
      'Primary': 'primary',
      'Secondary': 'secondary',
      'Error': 'error',
      'Warning': 'warning',
      'Info': 'info',
      'Success': 'success',
    }),
    size: figma.enum('Size', {
      'Small': 'small',
      'Medium': 'medium',
    }),
  },
  example: (props) => (
    <Chip
      label={props.label}
      variant={props.variant}
      color={props.color}
      size={props.size}
    />
  )
})

export default Chip
