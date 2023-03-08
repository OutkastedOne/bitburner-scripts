import { serverNetwork } from './core/servers.js'
export const scriptInfo_Combo = { name: '/core/hgwCombo.js', size: 2.4 }; // Script Info for the combo script
export const scriptInfo_Weak = { name: '/core/weak.js', size: 1.85 }; // Script Info for the weak script
export const scriptInfo_Grow = { name: '/core/grow.js', size: 1.95 }; // Script Info for the grow script
export const scriptInfo_Hack = { name: '/core/hack.js', size: 1.9 }; // Script Info for the hack script

export let servers_canHackNow = [];
export let servers_Forbidden = ['home','darkweb'];
export let servers_withRam = [];
export let toBeWritten = []; // list of files to be written to a file by the "writeToFile" function

/** @param {NS} ns */
//{Function_Discription} main function does nothing in this script, other scripts use the functions and variables in this script
export async function main(ns) {

}

/** @param {NS} ns */
//{Function_Discription} returns the time now in milliseconds to be used for coordination attacks
export async function getTime() {
	let dt = new Date();
	let timeNow = dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
	return timeNow;
}

/** @param {NS} ns */
//{Function_Discription} returns the players money, will add more here as needed
export async function playerMoney(ns) {
	return ns.getServerMoneyAvailable('home');
}

/** @param {NS} ns */
//{Function_Discription} compares the hacking level of the target against ours and returns true if we have a higher hacking level or false if we have a lower hacking level
export async function compareHackingLevel(ns, target) {
	if (await ns.getHackingLevel(target) < await ns.getHackingLevel('home')) {
		return true;
	}
	else if (await ns.getHackingLevel(target) > await ns.getHackingLevel('home')) {
		return false;
	}

}

/** @param {NS} ns */
/* 
if(!servers_Forbidden.includes(target)){

}
*/
//{Function_Discription} sorts servers in to various arrays, used after initial scan to kick things off
export async function sortServer(ns,target) {
	let tRamMax = ns.getServerMaxRam(target);
	let tRamUsed = ns.getServerUsedRam(target);
	let tMoneyAvail = ns.getServerMoneyAvailable(target);
	let tHackLevel = ns.getServerRequiredHackingLevel(target);
	if(tHackLevel < ns.getServerRequiredHackingLevel('home')){
		servers_canHackNow.push(target)
	}
}
/*
export async function sortServer(ns,target) {
	let tServ = await ns.getServer(target);
	if (tServ.ramMax > scriptInfo_Combo.size) {
		servers_ramForCombo.push(target);
		servers_withRam.push(target);
		if (await compareHackingLevel(ns,target) === true) {
			if(!servers_canHackNow.includes(target)){
				if(!servers_Forbidden.includes(target)){
					servers_canHackNow.push(target);
				}

			}
			
		}
	}
	else if (tServ.ramMax < scriptInfo_Combo.size && tServ.ramMax > scriptInfo_grow.size) {
		servers_withRam.push(target);
		if (await ns.getHackingLevel(target) < await ns.getHackingLevel('home')) {
			if(!servers_Forbidden.includes(target)){
				servers_canHackNow.push(target);
			}
		}
	}
	else if (tServ.ramMax < scriptInfo_Hack.size) {
		servers_victimsOnly.push(target);
		if (await ns.getHackingLevel(target) < await ns.getHackingLevel('home')) {
			if(!servers_Forbidden.includes(target)){
				servers_canHackNow.push(target);
			}
		}
	}
}
*/


/** @param {NS} ns */
// {Function_Discription} scans the network for new servers until we have them all saved in the core/servers.js file
export async function scanForServers(ns,toWrite) {
	for(let initScan in serverNetwork){
		let newScan = await ns.scan(serverNetwork[initScan]);
		for(let newServer in newScan){
			if (!serverNetwork.includes(newScan[newServer])) {
				await serverNetwork.push(newScan[newServer]);
				if(toWrite === true){
					if (!toBeWritten.includes(newScan[newServer])) {
						toBeWritten.push(newScan[newServer]);
					}
				}
				
			}
		}
	}
}

/** @param {NS} ns */
export async function runScript(ns,target,runType,runThreads){
    if(runType === 'hack'){
        await ns.exec(scriptInfo_Hack.name,target,runThreads)
    }else if (runType === 'grow'){
        await ns.exec(scriptInfo_Grow.name,target,runThreads)
    }else if (runType === 'weak'){
        await ns.exec(scriptInfo_Weak.name,target,runThreads)
    }else if (runType === 'combo'){
        await ns.exec(scriptInfo_Combo.name,target,runThreads)
    }
}

/** @param {NS} ns */
//{Function_Discription} runs the programs required to break the servers security so we can run scripts
export async function obtainRoot(ns, target) {
	if (ns.getServerNumPortsRequired(target) === 0) {
		if (ns.fileExists('NUKE.exe', 'home')) {
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target) === 1) {
		if (ns.fileExists('BruteSSH.exe', 'home')) {
			await ns.brutessh(target);
			await ns.nuke(target);
			return true;
		}

	}

	else if (ns.getServerNumPortsRequired(target) === 2) {
		if (ns.fileExists('FTPCrack.exe', 'home')) {
			await ns.brutessh(target);
			await ns.ftpcrack(target);
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target) === 3) {
		if (ns.fileExists('RelaySMTP.exe', 'home')) {
			await ns.brutessh(target);
			await ns.ftpcrack(target);
			await ns.relaysmtp(target);
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target) === 4) {
		if (ns.fileExists('HTTPWorm.exe', 'home')) {
			await ns.brutessh(target);
			await ns.ftpcrack(target);
			await ns.relaysmtp(target);
			await ns.httpworm(target);
			await ns.nuke(target);
			return true;
		}
	}

	else if (ns.getServerNumPortsRequired(target) === 5) {
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

/** @param {NS} ns */
//{Function_Discription} checks if the file exists on the server and if it does not we copy it there, if it is there we overwrite it, if its running, we kill it and then overwrite it
export async function checkFiles(ns, file, target) {
	// check if the files we need are on the target server and if they are replace them incase they were updated\
	if (!ns.fileExists(file, target)) {
		await ns.scp(file, target);
	}
	else if (ns.fileExists(file, target)) {
		await ns.rm(file,target);
		await ns.scp(file, target);
	}
	else if (ns.isRunning(file, target)) {
		await ns.kill(file, target);
		await ns.rm(file,target);
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

/** @param {NS} ns */
//{Function Discription} returns an array of running scripts on the target, this includes the PID of the script
export async function getProcessList(target) {
	return ns.ps(target);
}
