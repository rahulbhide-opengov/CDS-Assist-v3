/**
 * Figma Code Connect mapping for MUI TextField
 *
 * This file maps Figma Input components to MUI TextField components.
 */

import { figma } from '@figma/code-connect'
import { TextField } from '@mui/material'

// Map MUI TextField to Figma Input component
// Node ID: 11566:159360 (Input field example)
figma.connect(TextField, 'https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37?node-id=11566-159360', {
  props: {
    label: figma.string('Label'),
    value: figma.string('Value'),
    variant: figma.enum('Variant', {
      'Standard': 'standard',
      'Filled': 'filled',
      'Outlined': 'outlined',
    }),
    error: figma.boolean('Error'),
    disabled: figma.boolean('Disabled'),
    fullWidth: figma.boolean('Full Width'),
  },
  example: (props) => (
    <TextField
      label={props.label}
      value={props.value}
      variant={props.variant}
      error={props.error}
      disabled={props.disabled}
      fullWidth={props.fullWidth}
    />
  )
})

export default TextField
