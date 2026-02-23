import axios from "axios"

const addGameUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/addgame"
const addByeGameUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/addbyegame"
const CreateGame=async(newGame:any)=>{
    try {
        const response=await axios.post(addGameUrl,newGame)
        return response.data
    } catch (error) {
        console.error("Error while creating game",error)
        throw error
    }
    
}
export const CreateByeGame=async(newByeGame:any)=>{
    try {
        const response=await axios.post(addByeGameUrl,newByeGame)
        return response.data
    } catch (error) {
        console.error("Error while creating Bye game",error)
        throw error
    }
    
}
export default CreateGame;
