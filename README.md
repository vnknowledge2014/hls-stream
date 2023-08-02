# Guide to run HLS server

## Convert RTMP to HLS

### Init Project

    1. Open your terminal and change directory to `hls_stream`
    2. Run docker command in the terminal: `docker compose up -d`
    3. Wait docker compose done, and in your terminal run: `ffmpeg -stream_loop -1 -i Test.mp4 -c:v copy -c:a aac -strict experimental -f flv rtmp://localhost:1935/live/stream`

### Run HLS Server

    1. In your terminal run command: `./node_modules/.bin/ts-node --transpiler sucrase/ts-node-plugin src/index.ts` (for sure you are in the right directory `hls_stream`)
    2. Open VLC or any Player support m3u8 file stream, in the menu of VLC choose `open network` and paste that link into URL input: `http://localhost:8080/public/hls/stream.m3u8`
    3. Enjoy your video.


