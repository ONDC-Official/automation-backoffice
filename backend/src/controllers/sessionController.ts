import { Request, Response } from "express";
import {
  getSessionService,
  updateSessionService,
  deleteService,
  switchCacheDb,
  getAllSessionService,
} from "../services/sessionService";

const SESSION_EXPIRY = 3600; // 1 hour
const COOKIE_OPTIONS = { maxAge: SESSION_EXPIRY, httpOnly: true };

// Helper function to set session cookie
const setSessionCookie = (res: Response, sessionId: string) => {
  res.cookie("sessionId", sessionId, COOKIE_OPTIONS);
};

export const getSession = async (req: Request, res: Response) => {
  const subscriber_url = req.query.subscriber_url as string;

  if (!subscriber_url) {
    res.status(400).send({ message: "Session Key is required." });
    return;
  }

  try {
    const sessionData = await getSessionService(subscriber_url);
    res.status(200).send(sessionData);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error fetching session", error: error.message });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  const subscriber_url = req.query.subscriber_url as string;

  if (!subscriber_url) {
    res.status(400).send({ message: "subscriber url is required." });
    return;
  }

  const sessionData = req.body;
  try {
    const response = await updateSessionService(subscriber_url, sessionData);
    setSessionCookie(res, subscriber_url);
    res.status(200).send({ message: response });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error updating session", error: error.message });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  const subscriber_url = req.query.subscriber_url as string;

  if (!subscriber_url) {
    res.status(400).send({ message: "subscriber url is required." });
    return;
  }

  try {
    const response = await deleteService(subscriber_url);
    setSessionCookie(res, subscriber_url);
    res.status(200).send({ message: response });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error deleting session", error: error.message });
  }
};

export const updateCacheDb = async (req: Request, res: Response) => {
  const db_id = parseInt(req.query.db_id as string);
  console.log("Switching db", db_id);

  if (!db_id && db_id !== 0) {
    res.status(400).send({ message: "db_id is required." });
    return;
  }

  switchCacheDb(db_id);
  res.send({ message: "Cache DB swithced" });
};

export const getAllSession = async (req: Request, res: Response) => {
  try {
    const sessionData = await getAllSessionService();
    res.status(200).send(sessionData);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error fetching session", error: error.message });
  }
};
