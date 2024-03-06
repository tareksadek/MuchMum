import InfoIcon from '@mui/icons-material/Info';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ContactsIcon from '@mui/icons-material/Contacts';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ShareIcon from '@mui/icons-material/Share';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import PlaceHolderIcon from '@mui/icons-material/Star';

interface IconForLinkProps {
  linkfor: string;
}

const MenuLinkIcon = ({ linkfor }: IconForLinkProps) => {
  switch (linkfor) {
    case "basic info":
      return <InfoIcon />;
    case "info":
      return <InfoIcon />;
    case "about info":
      return <DocumentScannerIcon />;
    case "about":
      return <DocumentScannerIcon />;
    case "images":
      return <ImageIcon />;
    case "cover image":
      return <ImageIcon />;
    case "profile image":
      return <ImageIcon />;
    case "links":
      return <LinkIcon />;
    case "theme":
      return <ColorLensIcon />;
    case "contacts":
      return <ContactsIcon />;
    case "contactForm":
      return <FormatAlignCenterIcon />;
    case "qrcode":
      return <QrCodeIcon />;
    case "share":
      return <ShareIcon />;
    case "redirect":
      return <CallMissedOutgoingIcon />;
    case "account":
      return <ManageAccountsIcon />;
    case "impact":
      return <EnergySavingsLeafIcon />;
    case "analytics":
      return <AnalyticsIcon />;
    case "batches":
      return <ListAltIcon />;
    case "create batch":
      return <PostAddIcon />;
    case "users":
      return <PeopleAltIcon />;
    case "teams":
      return <GroupsIcon />;
    case "logout":
      return <LogoutIcon />;
    default:
      return <PlaceHolderIcon />; 
  }
}

export default MenuLinkIcon;