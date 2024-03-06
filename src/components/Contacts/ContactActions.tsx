import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface ContactActionsProps {
  onEdit?: ((contactId: string) => void) | null;
  onDelete?: ((contactId: string) => void) | null;
  onViewDetails: (contactId: string) => void;
  onAddToContacts: (contactId: string) => void;
  contactId: string;
}

const ContactActions: React.FC<ContactActionsProps> = ({
  onEdit,
  onDelete,
  onViewDetails,
  onAddToContacts,
  contactId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          onAddToContacts(contactId);
          handleClose();
        }}>
          Add to phone contacts
        </MenuItem>
        <MenuItem onClick={() => {
          onViewDetails(contactId);
          handleClose();
        }}>
          View details
        </MenuItem>
        {onEdit && (
          <MenuItem onClick={() => {
            onEdit(contactId);
            handleClose();
          }}>
            Edit contact
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => {
            onDelete(contactId);
            handleClose();
          }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ContactActions;
