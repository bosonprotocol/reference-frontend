import { createReducer } from "@reduxjs/toolkit";
import { updateBlockNumber } from "./actions";

const initialState = {
  blockNumber: {},
};

export default createReducer(initialState, (builder) =>
  builder.addCase(updateBlockNumber, (state, action) => {
    const { chainId, blockNumber } = action.payload;
    if (typeof state.blockNumber[chainId] !== "number") {
      state.blockNumber[chainId] = blockNumber;
    } else {
      state.blockNumber[chainId] = Math.max(
        blockNumber,
        state.blockNumber[chainId]
      );
    }
  })
);
