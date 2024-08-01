import fs from "fs";
import path from "path";
import { isDevMode } from '@angular/core';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

const successColor = '\x1b[32m%s\x1b[0m';
const dangerColor = '\x1b[31m%s\x1b[0m';
const checkIcon = '\u{2705}';
const uncheckIcon = '\u{2716}';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const targetPath = path.join(_dirname, `./environment${isDevMode() ? '' : '.prod'}.ts`);
const envKeys = ['RECAPTCHA_V2', 'RECAPTCHA_V3'];

function replaceEnvKeys(inputString, envKeys) {
    let outputString = inputString;
    envKeys.forEach((key) => {
        const regex = new RegExp(`${key}:\\s*'[\\s\\S]*?'`, 'g');
        outputString = outputString.replace(regex, `${key}: '${process.env[key]}'`);
    });
    return outputString;
}
fs.readFile(targetPath, 'utf8', (error, data) => {
    if (error) {
        console.error(error);
        throw error;
    }

    try {
        const outputString = replaceEnvKeys(data, envKeys);
        fs.writeFile(targetPath, outputString, (err) => {
            if (err) {
                console.error(err);
                throw err;
            }
            console.log(successColor, `${checkIcon} Successfully updated environment${isDevMode() ? '' : '.prod'}.ts`);
        });
    } catch (error) {
        console.error(dangerColor, `${uncheckIcon} Error parsing environment file:', ${error}`);
        console.error('Original file content:', data);
    }
});
