const nameToranchId = {
    [`Gold Reef Co.`]: 0,
    [`Infinite Harmony Farm`]: 1,
    [`Balancer Peak State`]: 2,
    [`The Ol' Algoranch`]: 3,
    [`Vega Slopes Range`]: 4,
    ['Opolis Reservation']: 5,
}

exports.bufficorns = require("./leaderboard.json").bufficorns.map((bufficorn) => {
    return {
      id: bufficorn.creationIndex,
      ranchId: nameToranchId[bufficorn.ranch],
      name: bufficorn.name,
      traits: [
          bufficorn.coat,
          bufficorn.coolness,
          bufficorn.intelligence,
          bufficorn.speed,
          bufficorn.stamina,
          bufficorn.vigor
      ] 
    } 
});
