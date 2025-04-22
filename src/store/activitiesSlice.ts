import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Attribute {
  key: string;
  type: string;
  required: boolean;
  array: boolean;
  elements?: string[];
}

interface Activity {
  collectionId: string;
  name: string;
  attributes: Attribute[];
}

interface ActivitiesState {
  activities: Activity[];
}

const initialState: ActivitiesState = {
  activities: [],
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setActivities(state, action: PayloadAction<Activity[]>) {
      console.log(action.payload);
      state.activities = action.payload;
    },
  },
});

export const { setActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;
