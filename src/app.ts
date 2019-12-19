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
const randomSort = (a: Player, b: Player) => (b.score - a.score || Math.random() > 0.5 ? 1 : -1)

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
		let count = 0 // error boundary
		// 1. make uniq pairs
		let pairs = this.makePairs()
		while (!pairs) {
			try {
				pairs = this.makePairs(true)
				if (count++ > 30) throw new Error('Stack overflow') // error boundary
				console.log(count)
				// ........
			} catch (error) {
				console.error('[crashed][round]')
				console.log('[crash][round]')
				console.log(this)
				console.log('[currentPlayers]')
				console.log(this.players)
				console.log('[pairs]')
				console.log(this.pairs)
				process.exit(404)
			}
		}
		// 2. play each pair
		const round = this.playRound(pairs)
		// 3. store pairs
		console.log('[ROUND]')
		console.log(round)
		this.storePairs(round)
		// 4. end of round
	}

	protected makePairs(random?: boolean): HashPairs | null {
		console.log(' =================== [makePairs] =================== ')
		let currPlayers = [...this.players].sort(random ? randomSort : sortingScore)
		// console.log(currPlayers)
		// to make sure pairs always sum up of in same order need to sort array
		const pairs: HashPairs = {}
		while (currPlayers.length) {
			// on each iteration check for pair.
			let i = 0
			let index = i + 1
			const curr = currPlayers[i]
			let next = currPlayers[index]
			let count = 0 // error boundary
			while (this.checkPair(curr, next)) {
				// error boundary
				if (count++ > 20) {
					console.error('[crash][makePairs]')
					console.log(this)
					console.log('[currentPlayers]')
					console.log(currPlayers)
					console.log('[pairs]')
					console.log(pairs)
					console.log('[curr]', curr)
					console.log('[next]', next)
					process.exit(404)
				}
				// if (currPlayers.length === 2 && this.checkPair(curr, next)) return null
				// continue to update next unless find uniq pairs
				if (!next && !currPlayers[index + 1]) return null
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
	protected checkPair(player1: Player, player2?: Player): boolean {
		if (!player1) throw new Error('[checkPair] Incorrect params passed')
		const hash = this.hash(player1, player2)
		console.log('[checkPair][hash]', hash)
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

const names = ['Alex', 'Nikita', 'Olga', 'Andrey', 'Vasily', 'Vladimir', 'Ivan', 'Nikolai']

/*==============================================
				TEST
===============================================*/

let count = 0
for (let i = 0; i <= 100; i++) {
	console.log(' ============================== NEW GAME ============================== ')
	console.log(' ============================== NEW GAME ============================== ')
	console.log(' ============================== NEW GAME ============================== ')
	console.log(' ============================== NEW GAME ============================== ')
	const players = []
	for (let i = 0; i < names.length; i++) players.push(new Player(makeId(), names[i]))
	const tourney = new Tourney(players, [])
	console.log(tourney)
	tourney.start(player => {
		console.log(tourney.players)
		console.log(tourney.pairs)
		console.log('[WINNER]', player)
		console.log(count++)
	})
}
