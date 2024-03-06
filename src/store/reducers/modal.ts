import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  openModal: string | null;
}

const initialState: ModalState = {
  openModal: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<string>) {
      state.openModal = action.payload;
    },
    closeModal(state) {
      state.openModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
