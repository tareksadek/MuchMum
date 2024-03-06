import React from 'react';
import { socialPlatforms } from '@/setup/setup';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { IconCircle } from './styles';

type SocialIconProps = {
  platform: 'facebook' | 'instagram' | 'linkedin';
  iconColor?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, iconColor }) => {
  let Icon;
  const platformData = socialPlatforms.find(p => p.platform === platform);
  const defaultColor = platformData && platformData.iconColor;
  const colorToUse = iconColor || defaultColor;  

  if (!platformData) return null;

  switch(platform) {
    case 'facebook':
      Icon = FacebookIcon;
      break;
    case 'instagram':
      Icon = InstagramIcon;
      break;
    case 'linkedin':
      Icon = LinkedInIcon;
      break;
    default:
      return null;
  }

  return (
    <IconCircle bgColor={colorToUse}>
      <Icon />
    </IconCircle>
  );
}

export default SocialIcon;
