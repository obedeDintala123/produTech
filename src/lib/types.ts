export type ImageType = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export type ColumnType = {
  id: string;
  boardId: string;
  title: string;
  description: string;
  cards: CardType[];
};

export type CardType = {
  id: string;
  columnId: string;
  title: string;
  description: string;
  completed: boolean;
};

export type BoardType = {
  id: string;
  title: string;
  visibility: string;
  background: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NoteType = {
  id: string;
  htmlText: string;
  createdAt: string;
};
