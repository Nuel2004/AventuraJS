export function categogorizePlayers(players, proPoints) {
    let proPlayers = "";
    let rookies = ""
    for (let i = 0; i < players.length; i++) {
        if (players[i].points >= proPoints) {
            proPlayers += players[i].name + "\n";;
        } else {
            rookies += players[i].name + "\n";
        }
    }
    return "\u{1F44D} ProPlayers:\n\n" + proPlayers + "\n\n\u{1F44E} Rookies:\n\n" + rookies + "\n\n";
}

export function rankPlayers(players) {
    players.sort((a,b) => b.points - a.points);
    let rankedPlayers = "\u{1F451} Ranked players:\n\n";
    for(let i = 0; i < players.length; i ++){
        rankedPlayers += i+1 + " - " + players[i].name + "\n";
    }
    return rankedPlayers;
}