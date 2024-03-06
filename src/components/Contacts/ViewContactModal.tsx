import React from 'react';
import { format, parse } from 'date-fns';
import { Drawer, List, ListItem, ListItemText, Box, Link, IconButton, Chip, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CallIcon from '@mui/icons-material/Call';
import { ContactType } from '@/types/contact';
import { useLayoutStyles } from '@/theme/layout';
import CloseIcon from '@mui/icons-material/Close';

interface ViewContactModalProps {
  open: boolean;
  onClose: () => void;
  onAddToContacts: (contactId: string) => void;
  contact: ContactType | null;
}

const ViewContactModal: React.FC<ViewContactModalProps> = ({ open, onClose, contact, onAddToContacts }) => {
  const layoutClasses = useLayoutStyles()
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      // PaperProps={{
      //   className: layoutClasses.radiusBottomDrawer
      // }}
      sx={layoutClasses.radiusBottomDrawer}
    >
      <Box p={2}>
        <List>
          <ListItem>
            <ListItemText
              primary={`${contact?.firstName || ''} ${contact?.lastName || ''}`}
              secondary={
                contact && typeof contact.createdOn === 'string' && format(parse(contact.createdOn as string, 'yyyy-MMM-dd', new Date()), 'yyyy-MMM-dd')
              }
              primaryTypographyProps={{
                variant: 'h4',
                align: 'center',
                style: {
                  textTransform: 'capitalize'
                }
              }}
              secondaryTypographyProps={{
                align: 'center',
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={(
                <Link
                  href={`mailto:${contact?.email}`}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={0.5}>
                    {contact?.email}
                    <Chip icon={<SendIcon style={{ fontSize: 16 }} />} label="Send Email" color="primary" />
                  </Box>
                </Link>
              )}
              primaryTypographyProps={{
                align: 'center',
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={(
                <Link
                  href={`tel:${contact?.phone}`}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={0.5}>
                    {contact?.phone}
                    <Chip icon={<CallIcon style={{ fontSize: 16 }} />} label="Call" color="primary" />
                  </Box>
                </Link>
              )}
              primaryTypographyProps={{
                align: 'center',
              }}
            />
          </ListItem>
          {/* {contact && typeof contact.createdOn === 'string' && (
            <ListItem>
              <ListItemText
                primary="Created On"
                secondary={format(parse(contact.createdOn as string, 'yyyy-MMM-dd', new Date()), 'yyyy-MMM-dd')}
                primaryTypographyProps={{
                  align: 'center',
                }}
                secondaryTypographyProps={{
                  align: 'center',
                }}
              />
            </ListItem>
          )} */}
          <ListItem>
            <ListItemText
              primary={contact?.note || ''}
              primaryTypographyProps={{
                align: 'center',
              }}
            />
          </ListItem>
        </List>
        <Box mt={2}>
          <Button
            onClick={() => {
              if (contact && contact.id) {
                onAddToContacts(contact.id);
              } else {
                console.error("Contact ID is not available.");
              }
            }}
            variant="contained"
            color="primary"
            fullWidth
          >
            Add to Contacts
          </Button>
        </Box>
      </Box>
      <IconButton
        aria-label="delete"
        color="primary"
        sx={layoutClasses.drawerCloseButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </Drawer>
  );
}

export default ViewContactModal;
