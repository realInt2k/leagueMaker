import { BigInt, BigDecimal, Bytes, log } from "@graphprotocol/graph-ts";

import {
  LeagueMaker,
  OwnershipTransferred,
  leagueClosed,
  leagueCreated,
  leagueLive,
  leagueJoined, 
  prizeClaimed
} from "../generated/LeagueMaker/LeagueMaker"

import { concat } from "@graphprotocol/graph-ts/helper-functions";

import { Game, League, Prize, LeaguePlayer, User} from "../generated/schema"


// BigNumber-like references
let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let ZERO_BD = BigDecimal.fromString("0");


export function handleLeagueCreated(event: leagueCreated): void {
  let league = new League(event.params._leagueId.toString());
  
  let game = Game.load(event.params._gameName.toString());
  if (game === null){
    game = new Game(event.params._gameName.toString());
    game.name = event.params._gameName.toString();
  }
  league.game = game.id;

  league.totalPlayers = ZERO_BI;
  league.totalPrize = ZERO_BI; 

  league.minEntry = event.params._minEntry;
  
  league.openTime = event.params._time;
  league.status = "Open";

  game.save();
  league.save();

}

export function handleLeagueLive(event: leagueLive): void {
  let league = League.load(event.params._leagueId.toString());
  if (league){
    league.status = "Live";
    league.save();
  }

}

export function handleLeagueJoined(event: leagueJoined): void{
  let leaguePlayer = new LeaguePlayer(event.params._nickName.toString());
  leaguePlayer.nickName = event.params._nickName;
  leaguePlayer.joinedAt = event.params._time;

  let user = User.load(event.params._pAddress.toString());
  if (user === null){
    user = new User(event.params._pAddress.toString());
    user.totalLeagues = ONE_BI;
  }else{
    let totallgs: BigInt = user.totalLeagues as BigInt;
    user.totalLeagues = totallgs.plus(ONE_BI);
  }

  if(user){
    leaguePlayer.user = user.id;
    user.totalLeaguesWinner = ZERO_BI;
  }
  let league = League.load(event.params._leagueId.toString());
  if (league){
    leaguePlayer.league = league.id;
  }
  user.save();
  leaguePlayer.save();
  user.save();
}

export function handleLeagueClosed(event: leagueClosed): void {
  let league = League.load(event.params._leagueId.toString());
  if (league){
    league.status = "Closed";
  }
  let wnrs = event.params._winners;
  for(let i =0; i < wnrs.length; i++){
    let prize = new Prize(event.params._leagueId.toString() + wnrs[i].toString());
    if (league){
    prize.league = league.id;
    }
    prize.amount = event.params._prizePerParticipant;
    prize.createdAt = event.params._time;
    let leaguePlayer = LeaguePlayer.load(wnrs[i]);
    if(leaguePlayer){
      leaguePlayer.isWinner = true;
      let str: string = leaguePlayer.user as string;
      let user = User.load(str);
      if (user){
        prize.claimableBy = user.id;
        if (user.totalLeaguesWinner){
          let total: BigInt = user.totalLeaguesWinner as BigInt;
          user.totalLeaguesWinner = total.plus(ONE_BI);
        }
        user.save();
      }
      leaguePlayer.save();
    }
    prize.claimed = false;
    if(prize){
    prize.save();
  }
    }
}

export function handlePrizeClaimed(event: prizeClaimed): void{
  let prize = Prize.load(event.params._leagueId.toString() + event.params._nickName.toString());
  if (prize){
    prize.claimed = true; 
    prize.claimedAt = event.params._time;
    prize.save();
  }
  
}