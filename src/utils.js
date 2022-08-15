import fs from 'fs';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function FileSelect(folder) {
    const files = fs.readdirSync(folder.toLowerCase());
    if (files.length === 0) {
        console.log("No files found in " + folder);
        console.log("Use the 'create' action to create a new file");
        process.exit(1);
    }
    const file = await inquirer.prompt({
        name: 'file_select',
        type: 'list',
        message: 'Which File Would You Like To Use?',
        choices: files,
    });
    return file.file_select;
}

export async function ViewFile(folder) {
    const file = await FileSelect(folder);
    const filePath = `${folder.toLowerCase()}/${file}`;
    const UserFile = fs.readFileSync(filePath, 'utf8');
    console.log(UserFile);
}

export async function CreateFile(folder) {
    const fileTitle = await inquirer.prompt({
        name: 'file_title',
        type: 'input',
        message: 'What Would You Like To Name Your New File?',
    });

    const data = await inquirer.prompt({
        name: 'file_data',
        type: 'editor',
        message: 'Edit Your File',
        default: '',
    });
    const fileData = data.file_data;
    const filePath = `${folder.toLowerCase()}/${fileTitle.file_title}`;

    fs.writeFileSync(filePath, fileData, (err) => {
        if (err) throw err;
    });
    const spinner = createSpinner("Writing...").start();
    await sleep();
    spinner.stop();
    console.log("File has been created!");
}

export async function EditFile(folder) {
    const file = await FileSelect(folder);
    const edit = await inquirer.prompt({
        name: 'edit_file',
        type: 'editor',
        message: 'Edit Your File',
    });
    const filePath = `${folder.toLowerCase()}/${file}`;
    const fileData = edit.edit_file;

    fs.writeFileSync(filePath, fileData, (err) => {
        if (err) throw err;
    });
    const spinner = createSpinner("Writing...").start();
    await sleep();
    spinner.stop();
    console.log(`${file} has been updated!`);
}

export async function DeleteFile(folder) {
    const file = await FileSelect(folder);
    const confirm = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: `Are you sure you want to delete ${file}?`,
    });
    if (confirm.confirm) {
        fs.unlinkSync(`${folder}/${file}`);
        console.log(`${file} has been deleted`);
    }
}