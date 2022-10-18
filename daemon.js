import * as helper from './core/helpers.js';
import { serverNetwork } from './core/servers.js';


/** this scrip is the main daemon script that launches everything else */
var timeNow = Date.now();

/** @param {NS} ns */
export async function main(ns) {
	ns.tprintf('initial server search under way')
	await helper.scanForServers(ns);
	let index = 0;
	for (let i = 0; i < serverNetwork.length; i++) {
		await helper.sortServer(ns, serverNetwork[i]);
		if (!ns.hasRootAccess(serverNetwork[i])) {
			ns.tprintf('found a server without root access: ' + serverNetwork[i]);
			await helper.obtainRoot(serverNetwork[i], ns);
			await ns.sleep(1000);
		}
		await helper.checkFiles(ns, helper.scriptInfo_Combo.name, serverNetwork[i]);
		if (!ns.isRunning(helper.scriptInfo_Combo.name, serverNetwork[i], serverNetwork[i], 0)) {
			if(ns.getHackingLevel(serverNetwork[i]) < ns.getHackingLevel('home')){
				await logic_Combo(ns, serverNetwork[i], serverNetwork[i], 0);
			}
			
		}
		index++;
		

	}
	// restart the loop when done
	if (index > serverNetwork.length) {
		index = 0
	}

}

/** @param {NS} ns */
export async function logic_Combo(ns, target, victim, delay) {
	await runOnce_Combo(ns, target, victim, delay);
}

/** @param {NS} ns */
export async function logic_Hack(ns, target, victim, delay) {
	let finishTime = timeNow + ns.getHackTime(victim);
	runOnce_Hack(ns, target, victim, finishTime);
	return finishTime;
}

/** @param {NS} ns */
export async function logic_Grow(ns, target, victim, delay) {

}

/** @param {NS} ns */
export async function logic_Weak(ns, target, victim, delay) {

}

/** @param {NS} ns */
export async function earlyHackSequence() {

}

export async function runOnce_Weak(ns, target, victim, delay) {
	let tServ = ns.getServer(target);
	let vServ = ns.getServer(victim);
	let tThreads = Math.floor(tServ.maxRam / helper.scriptInfo_Weak.size);
	if (tThreads >= 1) {
		await checkFiles(ns, '/core/weak.js', target);
		await ns.exec(helper.scriptInfo_Weak.name, target, tThreads, victim, delay);
	}
}

export async function runOnce_grow(ns, target, victim, delay) {
	let tServ = ns.getServer(target);
	let tThreads = Math.ceil(tServ.maxRam - tServ.ramUsed / helper.scriptInfo_Grow.size);
	if (tThreads >= 1) {
		await ns.exec(helper.scriptInfo_Grow.name, target, tThreads, victim, delay);
	}
}

export async function runOnce_Hack(ns, target, delay) {
	let tServ = ns.getServer(target);
	let tThreads = Math.floor(tServ.maxRam - tServ.ramUsed / helper.scriptInfo_Hack.size);
	if (tThreads >= 1) {
		await ns.exec(helper.scriptInfo_Hack.name, target, tThreads, victim, delay);
	}
}

export async function runOnce_Combo(ns, target, victim, delay) {
	let tServ = await ns.getServer(target);
	let tThreads = Math.floor(tServ.maxRam - tServ.ramUsed / helper.scriptInfo_Combo.size);
	if (tThreads >= 1) {
		await ns.tprint('dddddd')
		await ns.exec('', target, tThreads, victim,0);
	}
}
