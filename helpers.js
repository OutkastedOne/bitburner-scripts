import {serverNetwork} from './core/servers.js';
export const scriptInfo_Combo = { name: '/core/hgwCombo.js', size: 2.4 }; // Script Info for the combo script
export const scriptInfo_Weak = { name: '/core/weak.js', size: 1.85 }; // Script Info for the weak script
export const scriptInfo_Grow = { name: '/core/grow.js', size: 1.95 }; // Script Info for the grow script
export const scriptInfo_Hack = { name: '/core/hack.js', size: 1.9 }; // Script Info for the hack script

export var servers_Forbidden;
export var toBeWritten = []; // list of files to be written to a file by the "writeToFile" function
export var servers_canHackNow = [];
var servers_withRam = [];
var servers_victimsOnly = [];
var servers_ramForCombo = [];


/** @param {NS} ns */
export async function main(ns) {
	ns.tprint('This script is a Helper Script, other scripts will call these functions and this script does not actually run anything itself until then')
}

export async function getTime() {
	return Date.now();
}

export async function playerMoney(ns) {
	return ns.getServerMoneyAvailable('home');
}

export async function compareHackingLevel(target) {
	if (await ns.getHackingLevel(target) > await ns.getHackingLevel('home')) {
		return true;
	}
	else if (await ns.getHackingLevel(target) < await ns.getHackingLevel('home')) {
		return false;
	}

}

export async function sortServer(ns, target) {
	let tServ = await ns.getServer(target);
	if (tServ.ramMax > scriptInfo_Combo.size) {
		servers_ramForCombo.push(target);
		servers_withRam.push(target);
		if (ns.getHackingLevel(target) < ns.getHackingLevel('home')) {
			servers_canHackNow.push(target);
		}
	}
	else if (tServ.ramMax < scriptInfo_Combo.size && tServ.ramMax > scriptInfo_Combo.size) {
		servers_withRam.push(target);

	}
	else if (tServ.ramMax < scriptInfo_Hack.size) {
		servers_victimsOnly.push(target);
	}
}


export async function scanForServers(ns) {
	for (let i = 0; i < serverNetwork.length; i++) {
		let sScan = await ns.scan(serverNetwork[i]);
		for (let o = 0; o < sScan.length; o++) {
			if (!serverNetwork.includes(sScan[o])) {
				await serverNetwork.push(sScan[o]);
				if (!toBeWritten.includes(sScan[o])) {
					toBeWritten.push(sScan[o]);
				}
			}
		}
	}
}

export async function obtainRoot(target, ns) {
	if (ns.getServerNumPortsRequired(target) === 0) {
		if (ns.fileExists('NUKE.exe', 'home')) {
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target, ns) === 1) {
		if (ns.fileExists('BruteSSH.exe', 'home')) {
			await ns.brutessh(target);
			await ns.nuke(target);
			return true;
		}

	}

	else if (ns.getServerNumPortsRequired(target, ns) === 2) {
		if (ns.fileExists('FTPCrack.exe', 'home')) {
			await ns.brutessh(target);
			await ns.ftpcrack(target);
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target, ns) === 3) {
		if (ns.fileExists('RelaySMTP.exe', 'home')) {
			await ns.brutessh(target);
			await ns.ftpcrack(target);
			await ns.relaysmtp(target);
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target, ns) === 4) {
		if (ns.fileExists('HTTPWorm.exe', 'home')) {
			await ns.brutessh(target);
			await ns.ftpcrack(target);
			await ns.relaysmtp(target);
			await ns.httpworm(target);
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target, ns) === 5) {
		if (ns.fileExists('SQLInject.exe', 'home')) {
			await ns.brutessh(target);
			await ns.ftpcrack(target);
			await ns.relaysmtp(target);
			await ns.httpworm(target);
			await ns.sqlinject(target);
			await ns.nuke(target);
			return true;
		}
	}
}

export async function checkFiles(ns, file, target) {
	// check if the files we need are on the target server and if they are replace them incase they were updated\
	if (!ns.fileExists(file, target)) {
		await ns.scp(file, target);
	}
	else if (ns.fileExists(file, target)) {
		await ns.scp(file, target);
	}
	else if (ns.isRunning(file, target)) {
		await ns.kill(file, target);
		await ns.scp(file, target);
	}
}

export async function checkServersFile() {
	for (let i = 0; i < serverNetwork.length; i++) {
		if (!toBeWritten.includes(serverNetwork[i])) {
			toBeWritten.push(serverNetwork[i]);
		}
	}

}

export async function getProcessList(target) {
	return ns.ps(target);
}

export async function analyzeTarget(target) {
	let pList = getProcessList(target);
	for (let i = 0; i < pList.length; i++) {
		if (pList.filename.includes(scriptInfo_Hack.name) || pList.filename.includes(scriptInfo_Grow.name) || pList.filename.includes(scriptInfo_Weak.name)) {
			ns.print('A job is already running on ' + pList[i] + ' skipping it this time around');
		}
	}
}

