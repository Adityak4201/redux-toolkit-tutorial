import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { v1 as uuid } from "uuid";
import { Todo } from "./type";

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: "todos",
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{
          id: string;
          desc: string;
          isComplete: boolean;
        }>
      ) => {
        state.push(payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (
      state,
      action: PayloadAction<{
        id: string;
        desc: string;
      }>
    ) => {
      //   const index = state.findIndex(s=> s.id===action.payload.id);
      //   if(index===-1)
      //     state[index].desc=action.payload.desc;
      const todoToEdit = state.find((s) => s.id === action.payload.id);
      if (todoToEdit) todoToEdit.desc = action.payload.desc;
    },
    toggle: (
      state,
      action: PayloadAction<{
        id: string;
        isComplete: boolean;
      }>
    ) => {
      const todoToToggle = state.find((s) => s.id === action.payload.id);
      if (todoToToggle) todoToToggle.isComplete = action.payload.isComplete;
    },
    remove: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
    },
  },
});

const selectedTodoSlice = createSlice({
  name: "selectedTodo",
  initialState: null as string | null,
  reducers: {
    select: (state, action: PayloadAction<{ id: string }>) => action.payload.id,
  },
});

const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
