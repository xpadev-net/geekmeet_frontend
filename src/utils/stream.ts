const addTrackToStream = (stream: MediaStream, track: MediaStreamTrack) => {
  stream.addTrack(track);
  stream.dispatchEvent(new CustomEvent("_addtrack", { detail: { track } }));
};

const removeTrackFromStream = (
  stream: MediaStream,
  track: MediaStreamTrack,
) => {
  stream.removeTrack(track);
  stream.dispatchEvent(
    new CustomEvent("_removetrack", {
      detail: { track },
    }),
  );
};

export { addTrackToStream, removeTrackFromStream };
