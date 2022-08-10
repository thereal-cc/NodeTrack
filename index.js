#!/usr/bin/env node
// Based on Ideas by Rust Repo

import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import fs from "fs";
import open from 'open';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

let edit = false;
let running = true;

async function welcome() {
    const rainbow = chalkAnimation.rainbow('Welcome to NodeTrack!');
    await sleep();

    console.log("Track Ideas, Notes, and Tasks\n");
    rainbow.stop();
}

async function ChooseFolder() {
    const folder = await inquirer.prompt({
        name: 'folder_select',
        type: 'list',
        message: 'Which Folder Would You Like To Use?',
        choices: [
            "ToDo",
            "Ideas",
            "Notes",
            "Quit"
        ],
    });
    return folder.folder_select;
}

async function ChooseFile(folder) {
    const files = fs.readdirSync(folder.toLowerCase());
    const file = await inquirer.prompt({
        name: 'file_select',
        type: 'list',
        message: 'Which File Would You Like To Use?',
        choices: [
            "Create New File"
        ].concat(files), // Concat = Combines Arrays
    });

    if (file.file_select === "Create New File") {
        const newFile = await inquirer.prompt({
            name: 'new_file',
            type: 'input',
            message: 'What Would You Like To Name Your New File?',
        });
        edit = true;
        return newFile.new_file;
    }
    edit = false;
    return file.file_select;
}

function createFile(fileName, folder, data) {
    const filePath = `${folder.toLowerCase()}/${fileName}`;

    fs.writeFile(filePath, data, (err) => {
        if (err) throw err;
        const spinner = createSpinner("Writing...").start();
        sleep();
        spinner.stop();
        console.log(`${fileName} has been created!`);
    });
}

async function ViewFile(fileName, folder) {
    const filePath = `${folder}/${fileName}`;
    const data = fs.readFileSync(filePath.toLowerCase(), 'utf8');
    console.log(data);
}

async function EditFile() {
    const edit = await inquirer.prompt({
        name: 'edit_file',
        type: 'editor',
        message: 'Edit Your File',
        default: '',
    });
    return edit.edit_file;
}

async function main() {
    console.clear();
    await welcome();

    const folder = await ChooseFolder();

    if (folder === "Quit") {
        console.log("Thanks for using NodeTrack!");
        running = false;
        process.exit(1);
    } else {
        const fileName= await ChooseFile(folder);
        if (edit) {
            const file = await EditFile();
            createFile(fileName, folder, file);
        } else {
            await ViewFile(fileName, folder);
        }
    }
}

await main();