"use client";
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, NumberInput, Select, Table, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useLocalstorageState } from 'rooks';
import { EndSession } from './components/endSession';

interface sessionInfo {
  sessionName: string,
  teamData: string[],
  gameType: string,
  teamCount: number,
  gameOver: boolean
}

interface gameData {
  gameInfo: Array<{
    team: string,
    gamesBet: number,
    gamesWon: number,
    roundNumber: number,
    pointsWon: number
  }>
}

export default function Home() {
  // States for team management
  const [teamCount, setTeamCount] = useState(2);
  const [sessionData, setSessionData] = useLocalstorageState<sessionInfo>('sessionData', undefined);
  const [opened, { open, close }] = useDisclosure(false);
  const [gameStore, setGameStore] = useLocalstorageState<gameData>('gameStore', { gameInfo: [] });
  const [winner, setWinner] = useLocalstorageState<string>('winner', 'no one');

  function findWinner() {
    let teamData = sessionData.teamData;
    let winningPoints = -10000;
    let winningTeam = '';
    teamData.forEach((team) => {
      let points = gameStore.gameInfo.filter((data) => data.team == team).length == 0 ? 0 : gameStore.gameInfo.filter((data) => data.team == team).map((data) => {
        return data.pointsWon;
      }).reduce((a, b) => a + b)
      if (points > winningPoints) {
        winningPoints = points;
        winningTeam = team;
      }
     });
     setWinner(winningTeam);
  }

  if (sessionData === undefined || sessionData.gameOver) {
    return (
      <>
        <Modal opened={opened} onClose={close} title="Session Management" centered>
          <Modal.Body>
            <h1 className='font-extrabold text-[22.5px]'>Manage Session</h1>
            <form className='flex flex-col gap-3' onSubmit={(e) => {
              e.preventDefault();
              // Data
              let teamData = [];
              // @ts-ignore
              for (let i = 0; i < e.target['team_id'].length; i++) {
                // @ts-ignore
                teamData.push(e.target['team_id'][i].value);
              }
              
              setSessionData({
                // @ts-ignore
                sessionName: e.target['session_name'].value,
                teamData: teamData,
                teamCount: teamCount,
                // @ts-ignore
                gameType: e.target['game_type'].value == 'Normal' ? 'normal' : 'penalty',
                gameOver: false
              });
            }}>
              <TextInput label="Session Name" name='session_name' placeholder="Spades Tournament #6" required />
              <NumberInput label="Team Count" defaultValue={2} placeholder="2" onChange={(value) => {
                // @ts-ignore
                setTeamCount(parseInt(value));                            
              }} min={2} required />              
              {/* Code making team */}
              <div id='team-data'>
                {
                  // @ts-ignore
                  Array.from({ length: teamCount }, (a, i) => (
                    <TextInput key={i} label={`Team ${i + 1} Name`} name={'team_id'} placeholder={`Team ${i + 1}`} required />
                  ))
                }
              </div>
              <Select name='game_type' defaultValue={'Penalty'} label="Game Type" description="Gamemodes provide you most of the fun! Normal is where there is no loss with the formula (bet - gamesWon), but penalty is where you lose points with the set." placeholder='Select Game Type' data={['Normal', 'Penalty']} required />
              <Button type="submit" color="blue">Start Session</Button>
            </form>
          </Modal.Body>
        </Modal>
        <div className="flex flex-col p-10 items-center justify-center min-h-[100vh] dark:bg-[#1a1919] dark:text-white">
          <h1 className="font-black text-[60px]">Spades</h1>
          <p className='text-[21.5px]'>A simple tracker for the card game.</p>
          <a onClick={open} className="mt-5 p-4 rounded-lg active:dark:bg-slate-700 cursor-pointer pl-16 pr-16 dark:text-white hover:dark:bg-slate-700 text-black dark:bg-slate-800 bg-gray-300 active:bg-gray-500 hover:bg-gray-400">Start</a>
        </div>
      </>
    );
  }

  // Code for session
  return (
    <>
      {/* Content */}
      <div className="flex flex-col p-10 min-h-[100vh] dark:bg-[#1a1919] dark:text-white gap-4">
        <div className='flex flex-col gap-3'>
          <div>
            <h1 className='font-black text-[40px]'>{sessionData.sessionName}</h1>
          </div>
          <div className='width-[80%]'>
            <EndSession />
          </div>
        </div>
        <br />
        <h1 className='font-bold'>👑 Team with highest points: {winner}</h1>
        <p><i>Changes depending on if teams have any points in the record.</i></p>
        <br />        
        {/* Table */}
        <div className="overflow-x-auto w-full">
          <Table className="table-auto w-full" withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Td>
                  Rounds
                </Table.Td>
                {
                  sessionData.teamData.map((team, index) => (
                    <Table.Td key={index} abbr='Team Name'><h1 className='font-bold'>{team}</h1></Table.Td>
                  ))
                }
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {
                Array.from({ length: 13 }, (a, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>
                      Round {i + 1}
                    </Table.Td>
                    {
                      sessionData.teamData.map((team, index) => (
                        <Table.Td key={index} className='min-w-[40vw] md:min-w-[20vw]'>
                          <div className='flex flex-col gap-2'>
                            <NumberInput id={`${i}-${team}-games_bet`} onChange={(value) => {
                              let gameStoreData = gameStore.gameInfo;
                              // @ts-ignore
                              let gameData = [];
                              let points_achieved = 0;
                              if (sessionData.gameType == 'normal') {
                                // @ts-ignore
                                let bet = parseInt(value);
                                // @ts-ignore
                                let won = parseInt(document.getElementById(`${i}-${team}-games_won`).value);
                                if (won > bet) {
                                  points_achieved = (bet * 10) + (won-bet);
                                } else if (won == bet) {
                                  points_achieved = won * 10;
                                } else {
                                  points_achieved = (won - bet) * 10;
                                }
                              } else {
                                // @ts-ignore
                                let bet = parseInt(value);
                                // @ts-ignore
                                let won = parseInt(document.getElementById(`${i}-${team}-games_won`).value);
                                if (won > bet) {
                                  points_achieved = (bet * 10) + (won-bet);
                                } else if (won == bet) {
                                  points_achieved = won * 10;
                                } else {
                                  points_achieved = (-bet*10) + (won);
                                }
                              }

                              gameStoreData.forEach((masterData) => {
                                if (masterData.roundNumber == (i + 1) && masterData.team == team) {
                                  gameData.push({
                                    team: team,
                                    // @ts-ignore
                                    gamesBet: parseInt(value),
                                    // @ts-ignore
                                    gamesWon: parseInt(document.getElementById(`${i}-${team}-games_won`).value),
                                    roundNumber: i + 1,
                                    pointsWon: points_achieved
                                  });
                                } else {
                                  gameData.push(masterData);                                
                                }
                              });
                              // Check game data or if it exists
                              // @ts-ignore
                              if (gameData.length == 0 || gameData.every((data) => data.roundNumber !== (i + 1) || data.team !== team)) {
                                gameData.push({
                                  team: team,
                                  // @ts-ignore
                                  gamesBet: parseInt(value),
                                  // @ts-ignore
                                  gamesWon: parseInt(document.getElementById(`${i}-${team}-games_won`).value),
                                  roundNumber: i + 1,
                                  pointsWon: points_achieved
                                });
                              }
                              // Functionality for setting winner
                              findWinner();

                              setGameStore({
                                gameInfo: gameData
                              });
                            // @ts-ignore
                            }} placeholder='Bet' label="Games bet on winning" min={0}
                            
                            defaultValue={
                              (gameStore.gameInfo.find((data) => data.roundNumber === (i + 1) && data.team === team) || { gamesBet: 0 }).gamesBet
                            }
                            />

                            {/* Input 2 */}
                            <NumberInput id={`${i}-${team}-games_won`} onChange={(value) => {
                              let gameStoreData = gameStore.gameInfo;
                              // @ts-ignore
                              let gameData = [];
                              let points_achieved = 0;
                              if (sessionData.gameType == 'normal') {
                                // @ts-ignore
                                let bet = parseInt(document.getElementById(`${i}-${team}-games_bet`).value);
                                // @ts-ignore
                                let won = parseInt(value);
                                if (won > bet) {
                                  points_achieved = (bet * 10) + (won-bet);
                                } else if (won == bet) {
                                  points_achieved = won * 10;
                                } else {
                                  points_achieved = (won - bet) * 10;
                                }
                              }  else {
                                // @ts-ignore
                                let bet = parseInt(document.getElementById(`${i}-${team}-games_bet`).value);
                                // @ts-ignore
                                let won = parseInt(value);
                                if (won > bet) {
                                  points_achieved = (bet * 10) + (won-bet);
                                } else if (won == bet) {
                                  points_achieved = won * 10;
                                } else {
                                  points_achieved = (-bet*10) + (won);
                                }
                              }

                              gameStoreData.forEach((masterData) => {
                                if (masterData.roundNumber == (i + 1) && masterData.team == team) {
                                  gameData.push({
                                    team: team,
                                    // @ts-ignore
                                    gamesBet: parseInt(document.getElementById(`${i}-${team}-games_bet`).value),
                                    // @ts-ignore
                                    gamesWon: parseInt(value),
                                    roundNumber: i + 1,
                                    pointsWon: points_achieved
                                  });
                                } else {
                                  gameData.push(masterData);                                
                                }
                              });
                              // Check game data or if it exists
                              // @ts-ignore
                              if (gameData.length == 0 || gameData.every((data) => data.roundNumber !== (i + 1) || data.team !== team)) {
                                gameData.push({
                                  team: team,
                                  // @ts-ignore
                                  gamesBet: parseInt(value),
                                  // @ts-ignore
                                  gamesWon: parseInt(document.getElementById(`${i}-${team}-games_won`).value),
                                  roundNumber: i + 1,
                                  pointsWon: points_achieved
                                });
                              }
                              setGameStore({
                                gameInfo: gameData
                              });
                            
                            // Functionality for setting winner
                            findWinner();
                            
                            // @ts-ignore
                            }} placeholder='Games Won' label="Games won" min={0}
                            
                            defaultValue={
                              (gameStore.gameInfo.find((data) => data.roundNumber === (i + 1) && data.team === team) || { gamesBet: 0 }).gamesBet
                            } />

                            <p>Points Won: {
                              gameStore.gameInfo.filter((data) => data.roundNumber == (i + 1) && data.team == team).length == 0 ? 0 : gameStore.gameInfo.filter((data) => data.roundNumber == (i + 1) && data.team == team).map((data) => {
                                return data.pointsWon;
                              })
                            }
                            </p>
                          </div>
                        </Table.Td>
                      ))
                    }
                  </Table.Tr>
                ))
              }
              <Table.Tr>
                <Table.Td className='font-bold'>
                  Total Points
                </Table.Td>
                {/* Grabs total points per team */}
                {
                  sessionData.teamData.map((team, index) => (
                    <Table.Td key={index}>
                      {
                        gameStore.gameInfo.filter((data) => data.team == team).length == 0 ? 0 : gameStore.gameInfo.filter((data) => data.team == team).map((data) => {
                          return data.pointsWon;
                        }).reduce((a, b) => a + b)
                      }
                    </Table.Td>
                  ))
                }
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  )
}
