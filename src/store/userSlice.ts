import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"


const user = createSlice({
    name: 'user',
    initialState: {name: 'kim', age: 20},
    reducers: {
        changeName(state) {
            state.name = "park"
        },
        increaeAge(state, age:PayloadAction<number>){
            state.age +=  age.payload
        },
    }
})

export const { changeName, increaeAge} = user.actions;

export default user