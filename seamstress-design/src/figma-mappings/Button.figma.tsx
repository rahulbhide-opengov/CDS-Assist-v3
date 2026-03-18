/**
 * Figma Code Connect mapping for MUI Button
 *
 * This file maps Figma Button components to MUI Button components.
 * The mapping connects design properties in Figma to component props in code.
 */

import { figma } from '@figma/code-connect'
import { Button } from '@mui/material'

// Map MUI Button to Figma Button component
// Node ID: 14866:80581 (Large Primary Button example)
figma.connect(Button, 'https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37?node-id=14866-80581', {
  props: {
    variant: figma.enum('Variant', {
      'Contained': 'contained',
      'Outlined': 'outlined',
      'Text': 'text',
    }),
    color: figma.enum('Color', {
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
      'Large': 'large',
    }),
    children: figma.string('Label'),
  },
  example: (props) => (
    <Button
      variant={props.variant}
      color={props.color}
      size={props.size}
    >
      {props.children}
    </Button>
  )
})

export default Button
