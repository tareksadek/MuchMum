import React, { FC } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import Papa from 'papaparse';
import {
  CONNECTIONS_CSV_HEADER,
  CONNECTIONS_FACEBOOK_CSV_HEADER,
  CONNECTIONS_MAILCHIMP_CSV_HEADER,
  CONNECTIONS_SALESFORCE_CSV_HEADER,
  CONNECTIONS_HUBSPOT_CSV_HEADER
} from '../../setup/setup';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { mapToStandardCSV, mapToFacebookCSV, mapToMailchimpCSV, mapToSalesforceCSV, mapToHubspotCSV } from '../../utilities/utils';
import { ContactType } from '../../types/contact';

type Props = {
  contacts: ContactType[];
  fileName: string | null;
};

const CsvDownloader: FC<Props> = ({ contacts, fileName }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const downloadCSV = (headers: string[]) => {
    let mappedData: Array<Record<string, any>> = [];
    let csvFileType
    switch (headers) {
      case CONNECTIONS_CSV_HEADER:
        mappedData = mapToStandardCSV(contacts);
        csvFileType = ''
        break;
      case CONNECTIONS_FACEBOOK_CSV_HEADER:
        mappedData = mapToFacebookCSV(contacts);
        csvFileType = 'Facebook_Campaign';
        break;
      case CONNECTIONS_MAILCHIMP_CSV_HEADER:
        mappedData = mapToMailchimpCSV(contacts);
        csvFileType = 'MailChimp';
        break;
      case CONNECTIONS_SALESFORCE_CSV_HEADER:
        mappedData = mapToSalesforceCSV(contacts);
        csvFileType = 'SalesForce';
        break;
      case CONNECTIONS_HUBSPOT_CSV_HEADER:
        mappedData = mapToHubspotCSV(contacts);
        csvFileType = 'HubSpot';
        break;
      default:
        mappedData = [];
    }

    const csv = Papa.unparse({
      fields: headers,
      data: mappedData
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName || ''}_Contacts_${csvFileType}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleMenuClose();
  };

  return (
    <Box>
      <Box>
        <Button
          aria-haspopup="true"
          onClick={handleMenuOpen}
          startIcon={<DownloadIcon />}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Download as CSV
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => downloadCSV(CONNECTIONS_CSV_HEADER)}>Standard CSV</MenuItem>
        <MenuItem onClick={() => downloadCSV(CONNECTIONS_FACEBOOK_CSV_HEADER)}>Facebook CSV</MenuItem>
        <MenuItem onClick={() => downloadCSV(CONNECTIONS_MAILCHIMP_CSV_HEADER)}>Mailchimp CSV</MenuItem>
        <MenuItem onClick={() => downloadCSV(CONNECTIONS_SALESFORCE_CSV_HEADER)}>Salesforce CSV</MenuItem>
        <MenuItem onClick={() => downloadCSV(CONNECTIONS_HUBSPOT_CSV_HEADER)}>Hubspot CSV</MenuItem>
      </Menu>
    </Box>
  );
};

export default CsvDownloader;
