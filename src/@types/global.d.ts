declare global {
  interface MediaStreamEventMap {
    _removetrack: TrackUpdateEvent;
    _addtrack: TrackUpdateEvent;
  }
}

export type TrackUpdateEvent = CustomEvent<{ track: MediaStreamTrack }>;
