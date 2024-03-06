import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Box, Typography, Button } from "@mui/material";
import AdminDashboard from './AdminDashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import { defaultMenu, adminMenu } from '@/setup/setup';
import { authSelector } from '@/store/selectors/auth';
import MenuLinks from './MenuLinks';
import { useSideMenuStyles } from './appStyles';

type AppSideMenuProps = {
  isOpen: boolean;
  toggleDrawer: () => void;
};

type LinkType = {
  linkfor: string;
  path: string;
};

type MenuType = {
  title: string | null;
  links: LinkType[];
};

const AppSideMenu: React.FC<AppSideMenuProps> = ({ isOpen, toggleDrawer }) => {
  const classes = useSideMenuStyles()
  const { currentUser } = useSelector(authSelector);

  const filterMenu = (menu: MenuType[], linkFor: string): MenuType[] => {
    return menu.map(menuItem => {
      if (!menuItem.title) return menuItem;
      return {
        ...menuItem,
        links: menuItem.links.filter((link: LinkType) => link.linkfor !== linkFor),
      };
    });
  };

  let currentMenu = [...defaultMenu];

  if (currentUser?.isAdmin) {
    currentMenu = adminMenu
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={toggleDrawer}
      sx={classes.sideMenuPaper}
    >
      {currentUser?.isAdmin && (
        <AdminDashboard />
      )}
      <MenuLinks menu={currentMenu} onCloseMenu={toggleDrawer} />
    </Drawer>
  );
}

export default React.memo(AppSideMenu);
