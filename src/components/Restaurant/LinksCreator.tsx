import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import validator from 'validator';
import { useTheme } from '@mui/material/styles';
import { Box, Button, ButtonBase, IconButton, Typography, Drawer, Switch, TextField, List, ListItemIcon, ListItemText, FormControlLabel, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

interface LinksCreatorProps {
  links: {
    social: LinkType[];
    custom: LinkType[];
  };
  setLinks: React.Dispatch<React.SetStateAction<{
    social: LinkType[];
    custom: LinkType[];
  }>>;
}

const LinksCreator: React.FC<LinksCreatorProps> = ({ links, setLinks }) => {
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
  } = useForm<LinkType>({ mode: 'onChange' });
  const { errors } = formState;
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const isSocial = watch('isSocial', false);
  const isActive = watch('active', true);
  const errorForUrl = errors && errors.url;

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isLinkDetailsModalOpen = openModalName === 'linkDetails';
  const isSocialLinksListModalOpen = openModalName === 'SocialLinksList';

  const onSubmit = (data: LinkType) => {
    let newLinks = { social: [...links.social], custom: [...links.custom] };
    const newLinkData = {
      ...data,
      active: data.active ?? true,
      position: isEditing && editingLinkIndex !== null
        ? data.isSocial
          ? newLinks.social[editingLinkIndex].position
          : newLinks.custom[editingLinkIndex].position
        : data.isSocial
          ? newLinks.social.length
          : newLinks.custom.length
    };

    if (data.isSocial) {
      if (isEditing && editingLinkIndex !== null) {
        newLinks.social[editingLinkIndex] = newLinkData;
      } else {
        newLinks.social = [...newLinks.social, newLinkData];
      }
    } else {
      if (isEditing && editingLinkIndex !== null) {
        newLinks.custom[editingLinkIndex] = newLinkData;
      } else {
        newLinks.custom = [...newLinks.custom, newLinkData];
      }
    }
    setLinks(newLinks);
    setIsEditing(false);
    setEditingLinkIndex(null);
    dispatch(closeModal())
    reset({
      active: true,
      position: 0,
      isSocial: false,
      isCustom: false,
      platform: "",
      url: "",
      title: "",
    });
  };  

  const handleAddLink = (isSocial: boolean, platform?: string) => {
    if (platform) {
      setValue('platform', platform);
      setSelectedPlatform(platform)
    }

    if (isSocial) {
      setValue('isSocial', true);
      setValue('isCustom', false);
    } else {
      setValue('isSocial', false);
      setValue('isCustom', true);
    }
    
    setIsEditing(false);
    dispatch(openModal('linkDetails'));
  };

  const handleEditLink = (index: number, isSocialLink: boolean) => {
    const linkToEdit = isSocialLink ? links.social[index] : links.custom[index];
    
    for (const [key, value] of Object.entries(linkToEdit)) {
      setValue(key as keyof LinkType, value);
    }

    setValue('isSocial', isSocialLink);
    setValue('isCustom', !isSocialLink);

    setIsEditing(true);
    setEditingLinkIndex(index);
    setSelectedPlatform(linkToEdit.platform)
    dispatch(openModal('linkDetails'));
  };

  const handleDeleteLink = (index: number, isSocialLink: boolean) => {
    let linkToDelete = isSocialLink ? links.social[index] : links.custom[index];
    let message = isSocialLink
      ? `Are you sure you want to delete ${linkToDelete.platform}?`
      : `Are you sure you want to delete ${linkToDelete.title}?`;

    if (!window.confirm(message)) {
      return; // if the user clicks 'Cancel' on the confirmation dialog, exit without deleting
    }

    // Create a new copy of the links
    let newSocialLinks = [...links.social];
    let newCustomLinks = [...links.custom];

    if (isSocialLink) {
      newSocialLinks.splice(index, 1);
    } else {
      newCustomLinks.splice(index, 1);
    }

    // Recalculate positions for social links
    const updatedSocialLinks = newSocialLinks.map((link, idx) => {
      return { ...link, position: idx };
    });

    // Recalculate positions for custom links
    const updatedCustomLinks = newCustomLinks.map((link, idx) => {
      return { ...link, position: idx };
    });

    setLinks({
      social: isSocialLink ? updatedSocialLinks : links.social,
      custom: isSocialLink ? links.custom : updatedCustomLinks
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;    
    // If item is dropped outside the list, do nothing
    if (!destination) return;

    // If the item is dropped in the same place, do nothing
    if (source.index === destination.index && source.droppableId === destination.droppableId) return;

    // Deep clone the current links state
    const newLinks = JSON.parse(JSON.stringify(links));

    // Reorder the links based on drag and drop result
    const [removed] = newLinks[source.droppableId].splice(source.index, 1);
    newLinks[destination.droppableId].splice(destination.index, 0, removed);

    // Update the positions for all links in both source and destination lists
    [source.droppableId, destination.droppableId].forEach(id => {
      newLinks[id].forEach((link: LinkType, index: number) => {
        link.position = index;
      });
    })

    setLinks(newLinks);
  };

  return (
    <Box>
      <Box>
        <Box>
          <Box mb={2}>
            <Typography variant="h4" align="center">Social Links</Typography>
          </Box>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="social">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {[...links.social].sort((a, b) => a.position - b.position).map((link, index) => (
                    <Draggable key={link.platform} draggableId={link.platform} index={index}>
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
                                  ...(!link.active && classes.buttonContainerDisabled)
                                }}
                              >
                                <SocialIcon
                                  network={link.platform}
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  style={{ height: 30, width: 30 }}
                                  bgColor={link.active ? undefined : theme.palette.background.disabledSocialIcon}
                                />
                                <Box ml={1}>
                                  <Typography variant="body1" align="left">
                                    {truncateString(link.url, 20)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              {!link.active && (
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
            {(!links.social || links.social.length === 0) && (
              <Box
                onClick={() => dispatch(openModal('SocialLinksList'))}
                mb={1}
              >
                <Box sx={classes.placeholderIconContainer}>
                  <SocialLinksPlaceholderIcon />
                </Box>
              </Box>
            )}
            <Box width="100%">
              <Button
                onClick={() => dispatch(openModal('SocialLinksList'))}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Add Social Link
              </Button>
            </Box>
          </Box>
        </Box>

        <Box mt={4}>
          <Box mb={2}>
            <Typography variant="h4" align="center">Custom Links</Typography>
          </Box>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="custom">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {[...links.custom].sort((a, b) => a.position - b.position).map((link, index) => (
                    <Draggable
                      key={`${link.url.replace(/\s+/g, '')}${link.title && link.title.replace(/\s+/g, '')}`}
                      draggableId={`${link.url.replace(/\s+/g, '')}${link.title && link.title.replace(/\s+/g, '')}`}
                      index={index}
                    >
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
                              >
                                <Box ml={1}>
                                  <Typography variant="body1" align="left">
                                    <b>
                                      {link.title}
                                    </b>
                                  </Typography>
                                  <Typography variant="body1" align="left">
                                    {truncateString(link.url, 20)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              {!link.active && (
                                <Chip label="Inactive" size="small" sx={classes.inactiveChip} />
                              )}
                              <IconButton
                                onClick={() => handleEditLink(index, false)}
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
            {(!links.custom || links.custom.length === 0) && (
              <Box
                onClick={() => handleAddLink(false, 'custom')}
                mb={1}
              >
                <Box sx={classes.placeholderIconContainer}>
                  <CustomLinksPlaceholderIcon />
                </Box>
              </Box>
            )}
            <Box width="100%">
              <Button
                onClick={() => handleAddLink(false, 'custom')}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Add Custom Link
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={isSocialLinksListModalOpen}
        onClose={() => dispatch(closeModal())}
        // PaperProps={{
        //   className: layoutClasses.radiusBottomDrawer
        // }}
        sx={layoutClasses.radiusBottomDrawer}
      >
        <Box p={2}>
          <Typography variant="h4" align="center">Select a Platform</Typography>
          <List sx={classes.buttonsContainer}>
            {socialPlatforms.map(platform => (
              <ButtonBase
                key={platform.platform}
                onClick={() => {
                  dispatch(closeModal())
                  handleAddLink(true, platform.platform);
                }}
                disabled={links.social.some(link => link.platform === platform.platform)}
                sx={{
                  ...classes.buttonContainer,
                  ...(links.social.some(link => link.platform === platform.platform) && classes.buttonContainerDisabled),
                }}
              >
                <ListItemIcon>
                  <SocialIcon
                    network={platform.platform}
                    bgColor={links.social.some(link => link.platform === platform.platform) ? theme.palette.background.disabledSocialIcon : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={platform.platform} />
              </ButtonBase>
            ))}
          </List>
        </Box>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={layoutClasses.drawerCloseButton}
          onClick={() => dispatch(closeModal())}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>

      <Drawer
        anchor="bottom"
        open={isLinkDetailsModalOpen}
        // PaperProps={{
        //   className: layoutClasses.radiusBottomDrawer
        // }}
        sx={layoutClasses.radiusBottomDrawer}
        onClose={() => {
          dispatch(closeModal())
          setIsEditing(false);
          setEditingLinkIndex(null);
          setSelectedPlatform(null)
          reset({
            active: true,
            position: 0,
            isSocial: false,
            isCustom: false,
            platform: "",
            url: "",
            title: "",
          });
        }}
      >
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4" align="center">Link Details</Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isEditing && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                mb={2}
              >
                <Controller
                  name="active"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={e => {
                            setValue('active', e.target.checked);
                            field.onChange(e.target.checked);
                          }}
                        />
                      }
                      label="Active"
                    />
                  )}
                />
              </Box>
            )}

            {isSocial && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                mb={2}
              >
                <SocialIcon
                  network={selectedPlatform || ''}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                />
                <Box mt={1}>
                  <Typography variant="body1" align="center" sx={classes.platformTitle}>{selectedPlatform}</Typography>
                </Box>
              </Box>
            )}

            {isLinkDetailsModalOpen && !isSocial && (
              <Box mb={1}>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Title is required",
                    validate: value => (value && value.length <= 39) || "Title must be 40 characters or less"
                  }}
                  render={({ field: { ref, ...inputProps } }) => (
                    <TextField
                      label="Title*"
                      inputRef={ref}
                      {...inputProps}
                      inputProps={{
                        maxLength: 40
                      }}
                      disabled={!isActive}
                      error={Boolean(errors.title)}
                      helperText={errors.title?.message}
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
                name="url"
                control={control}
                defaultValue=""
                rules={{
                  required: "URL is required",
                  validate: value => {
                    return validator.isURL(value, { require_protocol: true }) || "Please enter a valid URL";
                  }
                }}
                render={({ field }) => (
                  <TextField
                    label="URL*"
                    {...field}
                    disabled={!isActive}
                    error={Boolean(errors.url)}
                    helperText={errors.url?.message}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (!inputValue.startsWith("https://") && !inputValue.startsWith("http://")) {
                        e.target.value = "https://" + inputValue;
                      }
                      field.onChange(e);
                    }}
                    fullWidth
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
                Confirm
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
            setIsEditing(false);
            setEditingLinkIndex(null);
            setSelectedPlatform(null)
            reset({
              active: true,
              position: 0,
              isSocial: false,
              isCustom: false,
              platform: "",
              url: "",
              title: "",
            });
          }}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </Box>
  );
}

export default LinksCreator;
