import express from 'express';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as http from 'http';
import cors from 'cors';
import path from 'path';

const app = express();
const rtmpPort = 1935; 
const hlsPort = 8080;

const hlsSegmentDirectory = 'public/hls'; 
const hlsPlaylistPath = 'public/hls/stream.m3u8'; 

app.use(cors());
app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('RTMP to HLS server is running.');
});

const server = http.createServer(app);

server.listen(hlsPort, () => {
  console.log(`HLS server is running on port ${hlsPort}.`);
});

const convertRtmpToHls = () => {
  if (!fs.existsSync(hlsSegmentDirectory)) {
    fs.mkdirSync(hlsSegmentDirectory, { recursive: true });
  }

  const ffmpegPath = 'ffmpeg'; 
  const rtmpUrl = `rtmp://localhost:${rtmpPort}/live/stream`; 

  // const hlsSegmentFilename = `${hlsSegmentDirectory}/stream_%03d.ts`;
  const ffmpegArgs = [
    '-i', rtmpUrl,
    // '-fflags', 'flush_packets',
    // '-hls_flags', 'delete_segments+discont_start',
    '-hls_time', '10',  // Set the segment duration (in seconds) for HLS
    '-hls_list_size', '0',  // Set the playlist size for HLS
    '-max_delay', '5',
    // '-flags', '-global_header',
    // '-level', '3.0',
    // '-start_number', '0',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-strict', 'experimental',
    '-f', 'hls',
    // '-vcodec',
    // 'copy',
    // '-y',
    hlsPlaylistPath,
  ];

  const ffmpegProcess = childProcess.spawn(ffmpegPath, ffmpegArgs);

  ffmpegProcess.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });
};

convertRtmpToHls();
