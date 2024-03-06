import React from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import { Box, Button, CircularProgress, IconButton, Typography, Drawer, Switch, TextField, Alert, FormControlLabel, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LinkType } from '@/types/restaurant';
import { MenuType } from '@/types/menu';
import { useLayoutStyles } from '@/theme/layout';
import { useLinksStyles } from './styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EditIcon } from '@/layout/CustomIcons';
import { RootState, AppDispatch } from '@/store/reducers';
import { openModal, closeModal } from '@/store/reducers/modal';
import { createRestaurantMenu } from '@/store/reducers/menu';
import { authSelector } from '@/store/selectors/auth';
import { restaurantSelector } from '@/store/selectors/restaurant';

interface LinksCreatorProps {
  menus: MenuType[] | null;
  loading: boolean;
  setLinks: React.Dispatch<React.SetStateAction<{
    social: LinkType[];
    custom: LinkType[];
  }>>;
}

const MenuCreator: React.FC<LinksCreatorProps> = ({ menus, loading, setLinks }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const classes = useLinksStyles()
  const layoutClasses = useLayoutStyles()
  const {
    control,
    handleSubmit,
    reset,
    formState,
  } = useForm<MenuType>({ mode: 'onChange' });
  const { errors } = formState;
  const { userId } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isFirstMenu = menus && menus.length === 0
  const isCreateMenuModalOpen = openModalName === 'createMenu';
  const router = useRouter();

  const onSubmit = (data: MenuType) => {
    const menuData = {
      name: data.name,
      isActive: isFirstMenu || undefined
    }
    if (restaurant && restaurant.id && userId) {
      dispatch(createRestaurantMenu({ userId, restaurantId: restaurant?.id, menuData }))
    }
    dispatch(closeModal())
    reset({
      isActive: isFirstMenu || false,
      name: "",
    });
  };  

  const handleCreateMenu = () => {
    dispatch(openModal('createMenu'));
  };

  const handleEditLink = (menuId: string | undefined) => {
    if (menuId) {
      router.push(`/menus/${menuId}`)
    } 
  };

  const handleDeleteLink = (index: number, isSocialLink: boolean) => {
   
  };

  return (
    <Box>
      <Box>
        <Box mt={4}>
          <Box mb={2}>
            <Typography variant="h4" align="center">Current Menus</Typography>
          </Box>
          <>
            {loading ? (
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {menus && menus.length > 0 && menus.map((menu, index) => (
                  <Box
                    sx={classes.linksListItem}
                    key={menu.id}
                  >
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Box ml={1}>
                            <Typography variant="body1" align="left">
                              <b>
                                {menu.name}
                              </b>
                            </Typography>
                            {menu.isActive && (
                              <Chip label="Active" size="small" sx={classes.activeChip} />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => handleEditLink(menu.id)}
                          sx={classes.linkItemIconButton}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteLink(index, false)}
                          sx={classes.linkItemIconButton}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </>  

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt={2}
          >
            {(!menus || menus.length === 0) && !loading && (
              <Box
                onClick={() => handleCreateMenu()}
                mb={1}
              >
                <Alert severity="warning">
                  There are no menus created yet for this restaurant. Start creating your first menu.
                </Alert>
              </Box>
            )}
            <Box width="100%">
              <Button
                onClick={() => handleCreateMenu()}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Create Menu
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={isCreateMenuModalOpen}
        sx={layoutClasses.radiusBottomDrawer}
        onClose={() => {
          dispatch(closeModal())
          reset({
            isActive: isFirstMenu || false,
            name: "",
          });
        }}
      >
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4" align="center">Create Menu</Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isCreateMenuModalOpen && (
              <Box mb={1}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Title is required",
                    validate: value => (value && value.length <= 39) || "Title must be 40 characters or less"
                  }}
                  render={({ field: { ref, ...inputProps } }) => (
                    <TextField
                      label="Menu Title*: i.e Menu, Appetizers, Drinks..."
                      inputRef={ref}
                      {...inputProps}
                      inputProps={{
                        maxLength: 40
                      }}
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
            )}

            <Box mt={2}>
              <Button
                type="submit"
                disabled={!formState.isValid}
                variant="contained"
                color="primary"
                fullWidth
              >
                Create
              </Button>
            </Box>
          </form>
        </Box>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={layoutClasses.drawerCloseButton}
          onClick={() => {
            dispatch(closeModal())
            reset({
              isActive: isFirstMenu || false,
              name: "",
            });
          }}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </Box>
  );
}

export default MenuCreator;
