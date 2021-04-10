import { credits } from "./data/credits";

export class Sound {
  public isMusicToggled: boolean = false;
  public isPlayingMusic: boolean = false;
  public music?: HTMLAudioElement;
  private musicIndex: number = Math.floor(Math.random() * credits.music.length);
  public musicError?: Error;

  // continously play music, alternating between all tracks
  public startMusic() {
    try {
      if (this.isMusicToggled && !this.isPlayingMusic && !this.musicError) {
        this.musicIndex = (this.musicIndex + 1) % credits.music.length; // random start, but cycle through all music
        const musicFile = credits.music[this.musicIndex].file;
        this.music = new Audio(`assets/music/${musicFile}`);
        this.music.volume = 0.3;
        this.music.playbackRate = 1;
        // this.music.muted = true;
        this.music.play();
        this.isPlayingMusic = true;
        this.music.addEventListener("ended", () => {
          this.isPlayingMusic = false; // will lead startMusic() to run again
        });
        console.log(this.music);
      }
    } catch (err) {
      console.error(err);
      this.musicError = err;
    }
  }

  public toggleMusicPause() {
    if (this.music) {
      this.isPlayingMusic ? this.music.pause() : this.music.play();
      this.isPlayingMusic = !this.isPlayingMusic;
    }
  }
}
