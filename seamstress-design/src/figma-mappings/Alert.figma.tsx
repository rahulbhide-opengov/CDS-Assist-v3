/**
 * Figma Code Connect mapping for MUI Alert
 *
 * This file maps Figma Alert components to MUI Alert components.
 */

import { figma } from '@figma/code-connect'
import { Alert } from '@mui/material'

// Map MUI Alert to Figma Alert component
// Node ID: 11609:175202 (Error alerts example)
figma.connect(Alert, 'https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37?node-id=11609-175202', {
  props: {
    severity: figma.enum('Severity', {
      'Error': 'error',
      'Warning': 'warning',
      'Info': 'info',
      'Success': 'success',
    }),
    variant: figma.enum('Variant', {
      'Standard': 'standard',
      'Filled': 'filled',
      'Outlined': 'outlined',
    }),
    title: figma.string('Title'),
    children: figma.children('Description'),
  },
  example: (props) => (
    <Alert severity={props.severity} variant={props.variant}>
      {props.title && <strong>{props.title}</strong>}
      {props.children}
    </Alert>
  )
})

export default Alert
