import { RedisService } from "ondc-automation-cache-lib";
import { ContextCache, SessionData } from "../interfaces/sessionData";
import {
  TransformedSessionData,
  SessionKeyType,
} from "../interfaces/sessionData";
import { fetchConfigService } from "./flowService";
import { logInfo, logError } from "../config/winstonConfig";

const SESSION_EXPIRY = 3600; // 1 hour

export const switchCacheDb = (db_id: number) => {
  logInfo({
    message: `Entering switchCacheDb Service Function`});
  RedisService.useDb(db_id);
  logInfo({
    message: `Exiting switchCacheDb Service Function`});
};

export const dummy = async (
  sessionId: string,
  data: SessionData
) => {
  const {
    city,
    domain,
    participantType,
    subscriberId,
    subscriberUrl,
    version,
  } = data;
  logInfo({
    message: `Entering createSession Service Function`});
  const flowConfig = fetchConfigService();

  const domainFlow = flowConfig.domain.find((s) => s.name === domain);
  const keys = domainFlow?.flows.map((f) => f.id);
  if (!keys) {
    throw new Error("Invalid domain");
  }
  let session_payloads: Record<string, any[]> = {};
  let contextCache: Record<string, ContextCache> = {};
  keys.forEach((key) => {
    session_payloads[key] = [];
    contextCache[key] = {
      latest_timestamp: new Date().toISOString(),
      latest_action: "",
      message_ids: [],
    };
  });
  const transformedData: TransformedSessionData = {
    active_session_id: sessionId,
    type: participantType,
    domain,
    version,
    city,
    subscriber_id: subscriberId,
    subscriber_url: subscriberUrl,
    np_id: subscriberId,
    session_payloads: session_payloads,
    context_cache: contextCache,
    difficulty_cache: {},
  };

  try {
    // Store session data in Redis
    await RedisService.setKey(
      subscriberUrl,
      JSON.stringify(transformedData),
      SESSION_EXPIRY
    );
    // await redisClient.set(sessionId, JSON.stringify(sessionData), 'EX', 3600);
    return "Session created successfully";
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export const getAllSessionService = async () => {
  try {
    logInfo({
      message: `Entering getAllSession Service Function`});
    // Fetch session data from Redis
    // const sessionData = await redisClient.get(sessionId);
    const sessionData = await RedisService.getAllKeys();
    // Return the session data if found
    logInfo({
      message: `Exiting getAllSession Service Function`});
    return sessionData;
  } catch (error: any) {
    // Return a 500 error in case of any issues
    logError({
      message: "Error in getAllSession Service Function",
      error,
    });
    throw new Error(`${error.message}`);
  }
};

export const getSessionService = async (sessionKey: SessionKeyType) => {
  try {
    logInfo({
      message: `Entering getSession Service Function`,
      meta: { sessionKey },
    });
    // Fetch session data from Redis
    // const sessionData = await redisClient.get(sessionId);
    const sessionData = await RedisService.getKey(sessionKey);
    // if (!sessionData) {
    //   throw new Error("Session not found");
    // }

    // Return the session data if found
    logInfo({
      message: `Exiting getSession Service Function`
    });
    return JSON.parse(sessionData || "{}");
  } catch (error: any) {
    // Return a 500 error in case of any issues
    logError({
      message: "Error in getSession Service Function",
      error,
      meta: { sessionKey }
    });
    throw new Error(`${error.message}`);
  }
};

// Update session data
export const updateSessionService = async (
  subscriber_url: string,
  data: any
) => {
  //   const {
  //     subscriberId,
  //     participantType,
  //     domain,
  //     transactionId,
  //     transactionMode,
  //     state,
  //     details,
  //     flowId,
  //     subscriberUrl,
  //     difficulty,
  //   } = data;
  logInfo({
    message: `Entering updateSession Service Function`,
    meta: { subscriber_url },
  });
  try {
    // Retrieve the session data from Redis
    const sessionData = await RedisService.getKey(subscriber_url);

    if (!sessionData) {
      logInfo({
        message: `Exiting updateSession Service Function`,
        meta: { subscriber_url },
      });
      throw new Error("Session not found");
    }

    // const session: TransformedSessionData = JSON.parse(sessionData);

    // Update session data fields
    // if (subscriberId) session.subscriber_id = subscriberId;
    // if (subscriberUrl) session.subscriber_url = subscriberUrl;
    // if (participantType) session.type = participantType;
    // if (domain) session.domain = domain;
    // if (flowId) session.current_flow_id = flowId;
    // if (difficulty) session.difficulty_cache = difficulty;

    // If transaction data is provided, update the transaction details
    // if (transactionId && transactionMode && state) {
    //     session.transactions[transactionId] = {
    //         transactionMode,
    //         state,
    //         data: details || {},
    //         createdAt: new Date().toISOString(),
    //     };
    // }

    // Save the updated session data back to Redis
    await RedisService.setKey(
      subscriber_url,
      JSON.stringify(data),
      SESSION_EXPIRY
    );
    logInfo({
      message: `Exiting updateSession Service Function`,
      meta: { subscriber_url },
    });
    return "Session updated successfully";
  } catch (error: any) {
    logError({
      message: "Error in updateSession Service Function",
      error,
      meta: { subscriber_url }
    });
    throw new Error(`${error.message}`);
  }
};

export const deleteService = async (subscriber_url: string) => {
  try {
    logInfo({
      message: `Entering deleteService Function`,
      meta: { subscriber_url },
    });
    await RedisService.deleteKey(subscriber_url);

    logInfo({
      message: `Exiting deleteService Function`,
      meta: { subscriber_url },
    });
    return "Session deleted successfully";
  } catch (e: any) {
    logError({
      message: "Error in deleteService Function",
      error: e,
      meta: { subscriber_url }
    });
    throw new Error(`${e.message}`);
  }
};

export const createSessionService = async (sessionID: string, data: any) => {
  console.log("session data payload", sessionID, data);

  try {
    const session = await RedisService.getKey(sessionID);

    console.log("session>>>>", session);

    if (session) {
      throw new Error("session already exists");
      return;
    }

    // Store session data in Redis
    const newSession = await RedisService.setKey(
      sessionID,
      JSON.stringify(data),
      SESSION_EXPIRY
    );
    console.log("session", newSession);
    return "Session created successfully";
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};
