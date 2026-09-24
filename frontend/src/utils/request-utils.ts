import axios from "axios";
import { CacheSessionData } from "../types/session-types";
import { toast } from "react-toastify";
import { backendUrl } from "../config/env";

export const triggerSearch = async (
	session: CacheSessionData,
	subUrl: string
) => {
	if (session.type === "BAP") {
		return;
	}
	console.log("session", session);
	const data = {
		subscriberUrl: subUrl,
		initiateSearch: true,
	};

	const response = await axios.post(
		`${backendUrl}/flow/trigger`,
		data
	);
	toast.info("search triggered");

	console.log("trigger response", response);
};

export const putCacheData = async (data: any, subUrl: string) => {
	return await axios.put(
		`${backendUrl}/sessions`,
		{
			...data,
		},
		{
			params: {
				subscriber_url: subUrl,
			},
		}
	);
};
