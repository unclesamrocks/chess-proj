const makeId = (): string => {
	return Math.random()
		.toString(32)
		.replace(/\./, '')
}

const sorting = (a: Player, b: Player) => {
	return a.score - b.score || a.id > b.id ? 1 : -1
}

/*==============================================
				Classes
===============================================*/

class Player {
	constructor(public id: string, public name: string, public score: number = 0) {}
}

class Tourney {
	constructor(
		public players: Player[],
		protected pairs: string[],
		protected score = {
			win: 3,
			loose: 0,
			draw: 1
		}
	) {}

	start() {
		this.round()
	}

	round() {
		// 1. make uniq pairs
		this.makePairs()
		// 2. store pairs
		// 3. play each pair
		// 4. store results
	}

	makePairs() {
		const currPlayers = [...this.players].sort(sorting)
		console.log(currPlayers)
		// to make sure pairs always sum up of in same order need to sort array
		const pairs: { hash?: string; pair?: Player[] } = {}
		for (let i = 0; i < currPlayers.length; i++) {
			// on each iteration check for pair
			const curr = currPlayers[i]
			let index = i + 1
			let next = currPlayers[index]
			while (this.checkPair(curr, next)) {
				// continue to update next unless find uniq pair
				next = currPlayers[++index]
			}
		}
	}

	isWinner() {}

	storePair(player1: Player, player2: Player) {}

	/**
	 * @returns `false` if pair IS uniq
	 */
	checkPair(player1: Player, player2: Player): boolean {
		return this.pairs.some(val => val === player1.id + player2.id)
	}
}

/*==============================================
				INIT
===============================================*/

const players = []
const names = ['Alex', 'Nikita', 'Olga', 'Andrey', 'Vasily', 'Vladimir', 'Ivan', 'Nikolai']
for (let i = 0; i < names.length; i++) players.push(new Player(makeId(), names[i]))

const tourney = new Tourney(players, [])
console.log(tourney)
tourney.start()
