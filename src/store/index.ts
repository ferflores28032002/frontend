import { create } from "zustand";

import { devtools } from "zustand/middleware";
import { LoginSlice, LoginStore } from "./Login/LoginSlice";

type ShareState = LoginStore;

export const useMainStore = create<ShareState>()(
  devtools((...a) => ({
    ...LoginSlice(...a),
  }))
);
