type Credits = {
  music: CreditsMusic[];
};
type CreditsMusic = {
  author: string;
  title: string;
  file: string;
  link: string;
  license: string;
};

export const credits: Credits = {
  music: [
    {
      author: "Zander Noriega",
      title: "Perpetual Tension",
      file: "Zander Noriega - Perpetual Tension.mp3",
      link: "https://opengameart.org/users/zander-noriega",
      license: "CC BY 3.0",
    },
    {
      author: 'Joe "Professorlamp" Reynolds',
      title: "Carmack",
      file: "Carmack NoFX.mp3",
      link: "https://opengameart.org/users/professorlamp",
      license: "CC BY 3.0",
    },
  ],
};
