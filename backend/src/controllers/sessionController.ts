import { Request, Response } from "express";
import {
  getSessionService,
  updateSessionService,
  deleteService,
  switchCacheDb,
  getAllSessionService,
  createSessionService,
} from "../services/sessionService";
import { logError, logInfo } from "../config/winstonConfig";

const SESSION_EXPIRY = 3600; // 1 hour
const COOKIE_OPTIONS = { maxAge: SESSION_EXPIRY, httpOnly: true };

// Helper function to set session cookie
const setSessionCookie = (res: Response, sessionId: string) => {
  logInfo({
    message: 'Entering setSessionCookie Controller Function',
    meta: { sessionId }
  })
  res.cookie("sessionId", sessionId, COOKIE_OPTIONS);
  logInfo({
    message: 'Exiting setSessionCookie Controller Function',
    meta: { sessionId }
  })
};

export const getSession = async (req: Request, res: Response) => {
  logInfo({
    message: 'Entering getSession Controller Function'
  })
  const subscriber_url = req.query.subscriber_url as string;

  if (!subscriber_url) {
    logInfo({
      message: 'Exiting getSession Controller Function'
    })
    res.status(400).send({ message: "Session Key is required." });
    return;
  }

  try {
    const sessionData = await getSessionService(subscriber_url);
    logInfo({
      message: 'Exiting getSession Controller Function',
      meta: { sessionId: subscriber_url }
    })
    res.status(200).send(sessionData);
  } catch (error: any) {
    logError({
      message: 'Error in getSession Controller Function',
      meta: { sessionId: subscriber_url },
      error
    })
    res
      .status(500)
      .send({ message: "Error fetching session", error: error.message });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  logInfo({
    message: 'Entering updateSession Controller Function',
  })
  const subscriber_url = req.query.subscriber_url as string;

  if (!subscriber_url) {
    logInfo({
      message: 'Exiting updateSession Controller Function'
    })
    res.status(400).send({ message: "subscriber url is required." });
    return;
  }

  const sessionData = req.body;
  try {
    const response = await updateSessionService(subscriber_url, sessionData);
    setSessionCookie(res, subscriber_url);
    logInfo({
      message: 'Exiting updateSession Controller Function',
      meta: { sessionId: subscriber_url }
    })
    res.status(200).send({ message: response });
  } catch (error: any) {
    logError({
      message: 'Error in updateSession Controller Function',error,meta: { sessionId: subscriber_url }});
    res
      .status(500)
      .send({ message: "Error updating session", error: error.message });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  logInfo({
    message: 'Entering deleteSession Controller Function'
  })
  const subscriber_url = req.query.subscriber_url as string;

  if (!subscriber_url) {
    res.status(400).send({ message: "subscriber url is required." });
    return;
  }

  try {
    const response = await deleteService(subscriber_url);
    setSessionCookie(res, subscriber_url);
    logInfo({
      message: 'Exiting deleteSession Controller Function',
      meta: { sessionId: subscriber_url }
    })
    res.status(200).send({ message: response });
  } catch (error: any) {
    logError({
      message: 'Error in deleteSession Controller Function',
      error,
      meta: { sessionId: subscriber_url }
    })
    res
      .status(500)
      .send({ message: "Error deleting session", error: error.message });
  }
};

export const updateCacheDb = async (req: Request, res: Response) => {
  logInfo({
    message: 'Entering updateCacheDb Controller Function'
  })
  const db_id = parseInt(req.query.db_id as string);

  if (!db_id && db_id !== 0) {
    logInfo({
      message: 'Exiting updateCacheDb Controller Function'
    })
    res.status(400).send({ message: "db_id is required." });
    return;
  }
  switchCacheDb(db_id);
  logInfo({
    message: 'Exiting updateCacheDb Controller Function',
    meta: { db_id }
  })
  res.send({ message: "Cache DB swithced" });
};

export const getAllSession = async (req: Request, res: Response) => {
  logInfo({
    message: 'Entering getAllSession Controller Function'
  })
  try {
    const sessionData = await getAllSessionService();
    logInfo({
      message: 'Exiting getAllSession Controller Function'
    })
    res.status(200).send(sessionData);
  } catch (error: any) {
    logError({
      message: 'Error in getAllSession Controller Function',
      error
    });
    res
      .status(500)
      .send({ message: "Error fetching session", error: error.message });
  }
};

export const createSession = async (req: Request, res: Response) => {
  const { sessionID, payload } = req.body;
  logInfo({
    message: 'Entering createSession Controller Function'
  })
  try {
    const response = await createSessionService(sessionID, payload);
    logInfo({
      message: 'Exiting createSession Controller Function'
    })
    res.status(200).send({ message: response });
  } catch (error: any) {
    logError({
      message: 'Error in getAllSession Controller Function',
      error
    });
    res
      .status(500)
      .send({ message: "Error creating session", error: error.message });
  }
};