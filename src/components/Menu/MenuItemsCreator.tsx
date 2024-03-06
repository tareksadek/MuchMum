import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import validator from 'validator';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Button, Slide, IconButton, Typography, Dialog, Switch, TextField, List, ListItemIcon, ListItemText, FormControlLabel, Chip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { SocialIcon } from 'react-social-icons';
import { socialPlatforms } from '@/setup/setup';
import { LinkType } from '@/types/restaurant';
import { useLayoutStyles } from '@/theme/layout';
import { useLinksStyles } from './styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EditIcon, DragHandleIcon } from '@/layout/CustomIcons';
import { RootState, AppDispatch } from '@/store/reducers';
import { openModal, closeModal } from '@/store/reducers/modal';
import { truncateString } from '@/utilities/utils';
import { SocialLinksPlaceholderIcon, CustomLinksPlaceholderIcon } from '@/layout/CustomIcons';
import { menuSelector } from '@/store/selectors/menu';
import AppContentContainer from '@/layout/AppContentContainer';
import { MenuSectionType } from '@/types/menu';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MenuItemsCreator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const classes = useLinksStyles()
  const layoutClasses = useLayoutStyles()
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState,
  } = useForm<MenuSectionType>({ mode: 'onChange' });
  const { errors } = formState;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { menu, menuSections, loadingMenu } = useSelector(menuSelector);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isLinkDetailsModalOpen = openModalName === 'linkDetails';
  const isSocialLinksListModalOpen = openModalName === 'SocialLinksList';

  const onSubmit = (data: MenuSectionType) => {

    dispatch(closeModal())
    reset({
      visible: true,
      sortOrder: 0,
      imageUrl: null,
      image: null,
      description: "",
      name: "",
    });
  };  

  const handleAddLink = (isSocial: boolean, platform?: string) => {

  };

  const handleEditLink = (index: number, isSocialLink: boolean) => {

    setIsEditing(true);
    dispatch(openModal('linkDetails'));
  };

  const handleDeleteLink = (index: number, isSocialLink: boolean) => {
    let message = isSocialLink
      ? `Are you sure you want to delete?`
      : `Are you sure you want to delete?`;

    if (!window.confirm(message)) {
      return; // if the user clicks 'Cancel' on the confirmation dialog, exit without deleting
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;    
    // If item is dropped outside the list, do nothing
    if (!destination) return;

    // If the item is dropped in the same place, do nothing
    if (source.index === destination.index && source.droppableId === destination.droppableId) return;

  };

  return (
    <Box>
      <Box>
        <Box>
          <Box mb={1} display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={1}>
            <Typography variant="h4" align="center">{menu?.name}</Typography>
          </Box>

          <Box mb={2} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Chip label="Active" size="small" sx={classes.activeChip} />
          </Box>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="social">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {menuSections && menuSections.sort((a, b) => a.sortOrder - b.sortOrder).map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={classes.linksListItem}
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
                                sx={classes.linkItemDragIcon}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                              >
                                <DragHandleIcon />
                              </Box>
                              
                              <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                  ...(!section.visible && classes.buttonContainerDisabled)
                                }}
                              >
                                <Box ml={1}>
                                  <Typography variant="body1" align="left">
                                    {section.name}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              {!section.visible && (
                                <Chip label="Inactive" size="small" sx={classes.inactiveChip} />
                              )}
                              <IconButton
                                onClick={() => handleEditLink(index, true)}
                                sx={classes.linkItemIconButton}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteLink(index, true)}
                                sx={classes.linkItemIconButton}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt={2}
          >
            <Box width="100%">
              <Button
                onClick={() => dispatch(openModal('linkDetails'))}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Add Section
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog
        fullScreen
        open={isLinkDetailsModalOpen}
        TransitionComponent={Transition}
        onClose={() => {
          dispatch(closeModal())
          setIsEditing(false);
          reset({
            visible: true,
            sortOrder: 0,
            imageUrl: null,
            image: null,
            description: "",
            name: "",
          });
        }}
      >
        <AppContentContainer>
          <Box p={2}>
            <Box mb={2}>
              <Typography variant="h4" align="center">Add Menu Section</Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                mb={2}
              >
                <Controller
                  name="visible"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={e => {
                            setValue('visible', e.target.checked);
                            field.onChange(e.target.checked);
                          }}
                        />
                      }
                      label="Active"
                    />
                  )}
                />
              </Box>

              {isLinkDetailsModalOpen && (
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
                        label="Section Title*"
                        inputRef={ref}
                        {...inputProps}
                        inputProps={{
                          maxLength: 40
                        }}
                        // disabled={!isActive}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                        fullWidth
                      />
                    )}
                  />
                </Box>
              )}

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >

                <Controller
                  name="description"
                  control={control}
                  rules={{ maxLength: 120 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Description"
                      multiline
                      rows={6}
                      helperText={errors.description ? "Your biography must not exceed 500 characters." : `${field.value ? field.value.length : '0'}/120`}
                      error={Boolean(errors.description)}
                    />
                  )}
                />
              </Box>

              <Box mt={2}>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Add Section
                </Button>
              </Box>
            </form>
          </Box>
        </AppContentContainer>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={layoutClasses.drawerCloseButtonRight}
          onClick={() => {
            dispatch(closeModal())
            setIsEditing(false);
            reset({
              visible: true,
              sortOrder: 0,
              imageUrl: null,
              image: null,
              description: "",
              name: "",
            });
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Dialog>
    </Box>
  );
}

export default MenuItemsCreator;
