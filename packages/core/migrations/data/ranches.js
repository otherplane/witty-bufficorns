const leaderboard = require("./leaderboard.json")
exports.ranches = leaderboard.ranches.map(ranch => {
    return {
        id: ranch.creationIndex,
        score: leaderboard.bufficorns.filter(b => b.ranch === ranch.name).reduce((acc, b) => b.score <= acc ? b.score : acc, 999999999)
    }
});
