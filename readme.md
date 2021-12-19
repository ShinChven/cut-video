# Video Cutter

> A simple video cutter for the terminal based on nodejs wrapping ffmpeg.

## Prerequisites

- Install node.js
- Install ffmpeg

## Installation

- Clone the repository to your local machine.
- Run `npm install` in the code directory.
- Run `npm link` to set `cut-video` to be one of your commands.

## Usage

```bash
cut-video <input> [-y]
```

- Input a video file to cut by config file.
- A yaml file will be created in the same directory as the input file if it does not exist.
- Edit your cutting plan in the yaml file and run the command again to cut.

## Config Example

```yaml
input: video.mp4
clips:
  clip - 1:        # output file basename for "clip - 1.mp4"
    start: '00:00:00'   # start time
    end: '00:00:10'     # end time
```
