/*==============================================
				Types
===============================================*/
type HashPairs = { [hash: string]: Player[] }
/*==============================================
				Funcs
===============================================*/

const makeId = (): string => {
	return Math.random()
		.toString(32)
		.replace(/\./, '')
}

const sorting = (a: Player, b: Player) => {
	return a.score - b.score || a.id > b.id ? 1 : -1
}
const sortingScore = (a: Player, b: Player) => b.score - a.score
const sortingId = (a: Player, b: Player) => (a.id > b.id ? 1 : -1)

/*==============================================
				Classes
===============================================*/

class Player {
	constructor(public id: string, public name: string, public score: number = 0) {}
}

class Tourney {
	constructor(
		public players: Player[],
		public pairs: string[],
		protected score = {
			win: 3,
			loose: 0,
			draw: 1
		}
	) {}

	start(cb: (p: Player) => void) {
		let winner: Player | null = null
		// game loop
		while (!winner) {
			this.round()
			winner = this.isWinner()
		}
		cb(winner)
	}

	protected round() {
		// 1. make uniq pairs
		const pairs = this.makePairs()
		// 2. play each pair
		const round = this.playRound(pairs)
		// 3. store pairs
		console.log('[ROUND]')
		console.log(round)
		this.storePairs(round)
		// 4. end of round
	}

	protected makePairs(): HashPairs {
		console.log(' =================== [makePairs] =================== ')
		let currPlayers = [...this.players].sort(sortingScore)
		// console.log(currPlayers)
		// to make sure pairs always sum up of in same order need to sort array
		const pairs: HashPairs = {}
		while (currPlayers.length) {
			// on each iteration check for pair.
			let i = 0
			let index = i + 1
			const curr = currPlayers[i]
			let next = currPlayers[index]
			while (this.checkPair(curr, next)) {
				// continue to update next unless find uniq pairs
				next = currPlayers[index++]
			}
			// if found pair || just 1 player in case no pair.
			pairs[this.hash(curr, next)] = next ? [curr, next] : [curr]
			// remove pair from array
			currPlayers = currPlayers.filter(el => el !== curr && el !== next)
		}
		return pairs
	}

	protected playRound(p: HashPairs): HashPairs {
		const r: HashPairs = {}
		Object.keys(p).forEach(key => {
			const win = Math.round(Math.random())
			p[key][0].score += win ? 3 : 0
			if (p[key][1]) p[key][1].score += !win ? 3 : 0
			r[key] = p[key]
		})
		return r
	}

	protected isWinner(): Player | null {
		const scores = [...this.players].sort(sortingScore)
		const topPlayer = scores.shift()
		if (!topPlayer) throw new Error('[isWinner][error] topPlayer seems undefined :(')
		const isWin = scores.every(player => player.score < topPlayer.score)
		if (isWin) return topPlayer
		else return null
	}

	protected storePairs(p: HashPairs) {
		this.pairs.push(...Object.keys(p))
	}

	/**
	 * @returns `false` if pair IS uniq.
	 */
	protected checkPair(player1: Player, player2: Player): boolean {
		if (!player1) return false
		const hash = player2 ? this.hash(player1, player2) : this.hash(player1)
		return this.pairs.some(val => val === hash)
	}

	protected hash(player1: Player, player2?: Player): string {
		if (!player2) return player1.id // case single player
		return [player1, player2]
			.sort(sortingId)
			.map(v => v.id)
			.join('')
	}
}

/*==============================================
				INIT
===============================================*/

const players = []
const names = ['Alex', 'Nikita', 'Olga', 'Andrey', 'Vasily', 'Vladimir', 'Ivan', 'Nikolai']
for (let i = 0; i < names.length; i++) players.push(new Player(makeId(), names[i]))
//.....
console.log(' ============================== NEW GAME ============================== ')
console.log(' ============================== NEW GAME ============================== ')
console.log(' ============================== NEW GAME ============================== ')
console.log(' ============================== NEW GAME ============================== ')
console.log(' ============================== NEW GAME ============================== ')
const tourney = new Tourney(players, [])
console.log(tourney)
tourney.start(player => {
	console.log(tourney.players)
	console.log(tourney.pairs)
	console.log('[WINNER]', player)
})
