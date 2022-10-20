#!/usr/bin/env node
import fs from "fs";
import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import {DeleteFile, ViewFile, CreateFile, EditFile, sleep} from './utils.js';

const actions = ["view", "edit", "create", "delete"];
const folders = ["todo", "ideas", "notes"];

const yarg = yargs(hideBin(process.argv));
const usage = "\nUsage: ntrack <action> <folder>";
const options = yarg.usage(usage).option("w", {alias:"welcome", describe: "display welcome message", type: "boolean", demandOption: false }).help(true).argv;

// Welcome MessAGE
async function welcome() {
    console.clear();
    const rainbow = chalkAnimation.rainbow('Welcome to NodeTrack!');
    await sleep();

    console.log("Track Ideas, Notes, and Tasks\n");
    console.log("Here's a quick guide to using NodeTrack:\n");
    console.log("Usage: ntrack <action> <folder>");
    console.log("Actions: view, edit, create, delete");
    console.log("Folders: todo, ideas, notes");
    console.log("Try It Out!\n");
    rainbow.stop();
}

// Call Function Related to Action
async function handleAction(action, folder) {
    try {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
      } catch (err) {
        console.error(err);
    }

    switch (action) {
        case "view":
            await ViewFile(folder);
            break;
        case "create":
            await CreateFile(folder);
            break;
        case "edit":
            await EditFile(folder);
            break;
        case "delete":
            await DeleteFile(folder);
            break;
    }
}

// Display Welcome Message
if (yarg.argv._[0] == null || yarg.argv._[0] == "-w" || yarg.argv._[0] == "--welcome") {  
    await welcome();
    process.exit(0);
}

// Handle Action
if (actions.includes(yarg.argv._[0]) && folders.includes(yarg.argv._[1])) {
    const action = yarg.argv._[0];
    const folder = yarg.argv._[1];

    await handleAction(action, folder);
    process.exit(0);
} 

// Error
console.log("Error: Invalid action");
console.log("Use --help or --welcome for more information");
process.exit(1);