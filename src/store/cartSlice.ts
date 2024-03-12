import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
    id: number;
    name: string;
    count: number;
}

const cart = createSlice({
    name: 'cart',
    initialState: {
        items: [
            { id: 1, name: 'White and Black', count: 2 },
            { id: 3, name: 'Grey Yordan', count: 1 }
        ]
    },
    reducers: {
        increaseCount(state, action: PayloadAction<number>) {
            const itemId = action.payload;
            let num = state.items.findIndex((a) => { return a.id === itemId })
            state.items[num].count++

        },
        addItem(state, action: PayloadAction<Item>) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            const itemIndex = state.items.findIndex(item => item.id === newItem.id);
            if (!existingItem) {
                state.items.push(newItem);
            } else {
                state.items[itemIndex].count++
            }
        },

        minusItem(state, action: PayloadAction<number>) {
            const itemId = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                if (state.items[itemIndex].count > 1) {
                    state.items[itemIndex].count--;
                } else {
                    state.items.splice(itemIndex, 1);
                }
            }
        },
        popItem(state, action: PayloadAction<number>) {
            const itemId = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === itemId);
            state.items.splice(itemIndex, 1);
        }
    }
});

export const { increaseCount, addItem, minusItem, popItem } = cart.actions;
export default cart;
