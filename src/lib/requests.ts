import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import {
  type ImageType,
  type BoardType,
  type ColumnType,
  type CardType,
  type NoteType,
} from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//Boards
export const getBoards = () => {
  return useQuery<BoardType[]>({
    queryKey: ["boards"],
    queryFn: async () => {
      await delay(2000);
      const { data } = await api.get("/boards");
      return data;
    },
    refetchInterval: 1000,
  });
};

export const getBoardById = (id: string) => {
  return useQuery<BoardType>({
    queryKey: ["boards", id],
    queryFn: async () => {
      await delay(2000);
      const { data } = await api.get(`/boards/${id}`);
      return data;
    },
  });
};

// Columns
export const getColumnsOfBoard = (id: string) => {
  return useQuery<ColumnType[]>({
    queryKey: ["columns", id],
    queryFn: async () => {
      const { data } = await api.get(`/columns?boardId=${id}`);
      return data;
    },
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
    staleTime: 2000,
  });
};

// Cards
export const getCardsOfColumn = (id: string) => {
  return useQuery<CardType[]>({
    queryKey: ["cards", id],
    queryFn: async () => {
      const { data } = await api.get(`/cards?columnId=${id}`);
      return data;
    },
  });
};

// Images
export const useImages = () => {
  return useQuery<ImageType[]>({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await fetch(
        "https://picsum.photos/v2/list?page=3&limit=6"
      );
      if (!response.ok) throw new Error("Erro ao carregar imagens");
      return response.json();
    },
  });
};

//Notes
export const getNotes = () => {
  return useQuery<NoteType[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await api.get("/notes");
      return data;
    },
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
    staleTime: 2000,
  });
};
