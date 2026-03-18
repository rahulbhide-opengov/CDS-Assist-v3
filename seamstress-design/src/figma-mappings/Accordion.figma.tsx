/**
 * Figma Code Connect mapping for MUI Accordion
 *
 * This file maps Figma Accordion components to MUI Accordion components.
 */

import { figma } from '@figma/code-connect'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

// Map MUI Accordion to Figma Accordion component
// Node ID: 908:98848 (Accordion Group example)
figma.connect(Accordion, 'https://www.figma.com/design/MxdeZ8e13qSmlenBVMmzzI/CDS-37?node-id=908-98848', {
  props: {
    title: figma.string('Title'),
    content: figma.children('Content'),
    expanded: figma.boolean('Expanded'),
    disabled: figma.boolean('Disabled'),
  },
  example: (props) => (
    <Accordion expanded={props.expanded} disabled={props.disabled}>
      <AccordionSummary>
        {props.title}
      </AccordionSummary>
      <AccordionDetails>
        {props.content}
      </AccordionDetails>
    </Accordion>
  )
})

export default Accordion
