import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import QRCodeStyling from "qr-code-styling";
import { appDomain } from '@/setup/setup';
import { RootState } from '@/store/reducers';
import { useLayoutStyles } from '@/theme/layout';

interface InvitationQrCodeProps {
  open: boolean;
  onClose: () => void;
}

const qrCode = new QRCodeStyling({
  width: 200,
  height: 200,
  dotsOptions: {
    color: '#000000',
    type: 'rounded',
  },
});

const QrDrawer: React.FC<InvitationQrCodeProps> = ({ open, onClose }) => {
  const layoutClasses = useLayoutStyles()
  const user = useSelector((state: RootState) => state.user.user);
  const [showQrCode, setShowQrCode] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        setShowQrCode(true);
      }, 300);
    } else {
      setShowQrCode(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (open && showQrCode && qrContainerRef.current) {
      qrCode.append(qrContainerRef.current);
      const newData = `${appDomain}/${user?.profileUrlSuffix}`;
      qrCode.update({ data: newData });
    }
  }, [open, showQrCode, user?.profileUrlSuffix]);

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
      <Box
        minHeight={450}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box width={200} height={200}>
          {showQrCode && <div id="qr-container" ref={qrContainerRef} style={{ width: 200, height: 200 }}></div>}
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
};

export default QrDrawer;
