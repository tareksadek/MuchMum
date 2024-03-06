import React from 'react';
import { useRouter } from 'next/router';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { defaultMenu, adminMenu } from '@/setup/setup';
import MenuLinkIcon from './MenuLinkIcon';
import { useSideMenuStyles } from './appStyles';

type MenuLinkProps = {
  menu: typeof defaultMenu | typeof adminMenu;
  onCloseMenu: () => void;
};

const MenuLinks: React.FC<MenuLinkProps> = ({ menu, onCloseMenu }) => {
  const classes = useSideMenuStyles()
  const router = useRouter();

  return (
    <List sx={classes.menuLinksList}>
      {menu.map((item, index) => {
        if (item.title === null) {
          return (
            <ListItemButton
              key={index}
              onClick={() => {
                router.push(item.links[0].path);
                onCloseMenu();
              }}
              selected={location.pathname === item.links[0].path}
            >
              <ListItemIcon>
                <MenuLinkIcon linkfor={item.links[0].linkfor} />
              </ListItemIcon>
              <ListItemText primary={item.links[0].linkfor} />
            </ListItemButton>
          );
        }

        return (
          <Accordion
            key={index}
            sx={classes.accordionRoot}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              classes={classes.accordionSummaryRoot}
            >
              <ListItemText primary={item.title} />
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {item.links.map((link) => (
                  <ListItemButton 
                    key={link.path} 
                    onClick={() => {
                      onCloseMenu();
                      router.push(link.path);
                    }}
                    selected={location.pathname === link.path}
                  >
                    <ListItemIcon>
                      <MenuLinkIcon linkfor={link.linkfor} />
                    </ListItemIcon>
                    <ListItemText primary={link.linkfor} />
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </List>
  );
};

export default MenuLinks;
