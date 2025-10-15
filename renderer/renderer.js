let mediaRecorder = null;
let stream = null;
let chunks = [];
let recording = false;

const elStart = document.getElementById('btn-start');
const elStop = document.getElementById('btn-stop');
const elShot = document.getElementById('btn-shot');
const elGallery = document.getElementById('gallery');
const elStatus = document.getElementById('status');
const elDot = document.getElementById('dot');
const elDownload = document.getElementById('download');

function setStatus(text, mode = 'idle') {
  elStatus.textContent = text;
  elDot.className = 'dot ' + (mode === 'rec' ? 'warn' : mode === 'ok' ? 'ok' : mode === 'err' ? 'err' : '');
}
function setBusy(b) {
  elStart.disabled = b;
  elStop.disabled = !b;
  elShot.disabled = b;
}

async function getStream() {
  return await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
}

async function startRecording() {
  if (recording) return;
  setStatus('Requesting screen…', 'warn');
  stream = await getStream();
  try {
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  } catch (e) {
    console.warn('Falling back MediaRecorder:', e);
    mediaRecorder = new MediaRecorder(stream);
  }

  chunks = [];
  mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  mediaRecorder.onstop = () => setStatus('Stopped', 'ok');

  mediaRecorder.start(1000);
  recording = true;
  setBusy(true);
  setStatus('Recording…', 'rec');
  elDownload.textContent = '';
  elDownload.removeAttribute('href');
}

async function stopRecording() {
  if (!recording) return;
  await new Promise((resolve) => {
    mediaRecorder.onstop = () => resolve();
    mediaRecorder.stop();
  });
  stream.getTracks().forEach(t => t.stop());
  recording = false;
  setBusy(false);

  const blob = new Blob(chunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  elDownload.href = url;
  elDownload.download = 'capture.webm';
  elDownload.textContent = 'Download capture.webm';
  setStatus('Ready', 'ok');
}

async function takeScreenshot() {
  setStatus('Taking screenshot…', 'warn');
  const s = await getStream();
  const [track] = s.getVideoTracks();
  if (typeof ImageCapture !== 'undefined') {
    const image = new ImageCapture(track);
    const bitmap = await image.grabFrame();
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap, 0, 0);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const img = new Image(); img.src = url; elGallery.prepend(img);
      track.stop(); setStatus('Screenshot captured', 'ok');
    }, 'image/png');
  } else {
    const video = document.createElement('video');
    video.srcObject = s; await video.play();
    await new Promise(r => video.onloadedmetadata = r);
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const img = new Image(); img.src = url; elGallery.prepend(img);
      track.stop(); setStatus('Screenshot captured', 'ok');
    }, 'image/png');
  }
}

elStart.addEventListener('click', startRecording);
elStop.addEventListener('click', stopRecording);
elShot.addEventListener('click', takeScreenshot);
