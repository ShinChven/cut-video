#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const execSync = require('child_process').execSync;
const readlineSync = require('readline-sync');

const [, , filename, yes] = process.argv;

/**
 * @param {string} Video filepath
 */
const videoPath = path.posix.resolve(filename);

// Check if the video exits.
if (!fs.existsSync(videoPath)) {
    console.error('File not found');
    return;
}

// Check if the video is a valid video file.
const stats = fs.statSync(videoPath);
if (!stats.isFile()) {
    console.error('Not a file');
    return;
}

/**
 * @param {string} Video cutting config filepath
 */
const configPath = path.posix.resolve(filename) + '.cut.yml'

// Check if the config exits.
if (!fs.existsSync(configPath)) { // if the file does not exist, create one
    console.log('Video cutting config file does not exist. creating one...');
    const clips = {};
    clips[`${path.posix.basename(videoPath)} - 1`] = {
        start: "00:00:00",
        end: "00:00:00",
    }
    fs.writeFileSync(configPath, yaml.dump({
        input: videoPath,
        clips
    }) + '\n');
    console.log('Cutting config file created: ' + configPath);
    console.log('Please edit the config file and run again.');

    return;
}

// Assuming the config file exists, cut the video by it.

const moment = require('moment');
const runtime = (start,end)=>{
    const diff = moment(end, 'HH:mm:ss.SSS').diff(moment(start, 'HH:mm:ss.SSS'), 'seconds');
    return diff;
}


console.log('Cutting video by config file:', configPath);

const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
console.log(config);

const clips = config.clips;

Object.keys(clips).forEach(key => {
    const ext = path.extname(videoPath);
    const clip = clips[key];
    const start = clip.start;
    const t = runtime(start, clip.end);
    const input = config.input;
    const output = path.posix.resolve(path.dirname(input), key + ext);
    if (fs.existsSync(output)) {
        if (yes === '-y') {
            // do nothing and continue;
        } else {
            const answer = readlineSync.question('File already exists. Overwrite? (y/N)');
            if (answer.toLowerCase().indexOf('y') >= 0) {
                console.log('Overwriting...')
            } else {
                console.log('Skipping clip:', key);
                return;
            }
        }
    }
    const command = `ffmpeg -ss "${start}" -i "${input}" -t "${t}" -c copy "${output}" -y`;
    console.log(command);
    execSync(command, {});
});