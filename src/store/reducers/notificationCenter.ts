import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationType = 'error' | 'success' | 'warning';

interface Notification {
  message: string;
  type: NotificationType;
  horizontal?: 'left' | 'right' | 'center';
  vertical?: 'top' | 'bottom';
}

interface NotificationState {
  notification: Notification | null;
  isOpen: boolean;
}

const initialState: NotificationState = {
  notification: null,
  isOpen: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: {
      reducer(state, action: PayloadAction<Notification>) {
        state.notification = action.payload;
        state.isOpen = true;
      },
      prepare(notificationData: Notification) {
        return {
          payload: {
            ...notificationData,
            horizontal: notificationData.horizontal || 'right',
            vertical: notificationData.vertical || 'top',
          },
        };
      },
    },
    hideNotification(state) {
      state.notification = null;
      state.isOpen = false;
    },
  },
});

export const { setNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
