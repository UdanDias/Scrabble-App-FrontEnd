import { useState } from "react";
import { Card } from "react-bootstrap";


interface Player{
    playerId:string;
    firstName:string;
    lastName:string;
    age:number;
    gender:string;
    dob:string;
    email:string;
    phone:string;
    address:string;
    faculty:string;
    academicLevel:string;
    accountCreatedDate:string;
}
interface Game{
    gameId:string;
    player1Id:string;
    player2Id:string;
    score1:number;
    score2:number;
    margin:number;
    isgameTied:string;
    winnerId:string;
    gameDate:string;
    isByeGame:string;

}
export function Profile(){
    return(
        <>
            <div  className="d-flex justify-content-center p-4">
                <Card  style={{ width: '50rem' }}>
                    <Card.Body>
                        <Card.Title>Welcome</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            
        </>
    );
}