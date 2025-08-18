import { atom, createStore } from "jotai";

export const isTextBoxVisibleAtom = atom(false);
export const textBoxContentAtom = atom("");
export const nextpage = atom("");
export const store = createStore();
