import * as servers from './core/servers.js';
import * as helpers from './core/helpers.js';

var servers_withRam = [];
var servers_victimsOnly = [];
var servers_ramForCombo = [];
var timeNow = new Date().getTime().toLocaleString();

/** @param {NS} ns */
export async function main(ns) {
	if(!ns.fileExists('/core/servers.js','home')){
		ns.exec('FirstRun.js','home',1);
	}
	else if(servers.serverNetwork.length <= 5){
		ns.tprintf('initial server search under way');
		await helpers.scanForServers(ns,false);
	}
	ns.tprint('search complete, sorting each server... i hope');
	//for(let target in servers.serverNetwork)
	for(let i = 0; i < servers.serverNetwork.length; i++){
		await helpers.sortServer(ns,servers.serverNetwork[i])
	}
	ns.tprint(helpers.servers_canHackNow);
}

export async function initialHack(target,victim,ns){
	let runThreads = Math.floor(await ns.getServerMaxRam(target));

}

// export async function scanForServers(ns) {
// 	for(let server in serverNetwork){
// 		let sScan = await ns.scan(serverNetwork[server]);
// 		for(let newServer in sScan){
// 			if (!serverNetwork.includes(sScan[newServer])) {
// 				await serverNetwork.push(sScan[newServer]);
// 			}
// 		}
// 	}
// }


export async function earlyHackSequence(ns) {
	for(let i = 0; i < helpers.servers_canHackNow.length;i++){
		await helpers.checkFiles(ns, helpers.scriptInfo_Combo.name, helpers.servers_canHackNow[i]);
		if (!ns.hasRootAccess(helpers.servers_canHackNow[i])) {
			await helpers.obtainRoot(ns,helpers.servers_canHackNow[i]);
			if (await helpers.compareHackingLevel(ns,helpers.servers_canHackNow[i]) === true) {
				await logic_Combo(ns, helpers.servers_canHackNow[i], helpers.servers_canHackNow[i]);
			
			}
		}
		if (!ns.isRunning(helpers.scriptInfo_Combo.name, servers_canHackNow[i])) {
			if (await helpers.compareHackingLevel(ns,helpers.servers_canHackNow[i]) === true) {
				await logic_Combo(ns, helpers.servers_canHackNow[i], helpers.servers_canHackNow[i]);
			}
		}
	}
}

export async function analyzeServer(ns,target){
	
} 

export async function runOnce_Combo(ns, target, victim) {
	let tServ = ns.getServer(target);
	let tThreads = Math.floor((tServ.maxRam - tServ.ramUsed) / scriptInfo_Combo.size);
	if (tThreads >= 1) {
		await ns.exec(helpers.scriptInfo_combo.name, target, tThreads, victim);
	}
}
