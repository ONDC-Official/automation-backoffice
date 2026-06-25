import { Request, Response, NextFunction } from "express";
import { logDebug } from "../config/winstonConfig";

export default (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (data: any) {
        const transaction_id = req.body?.transaction_id;
        logDebug({
            message: `Response Log`,
            transaction_id,
            meta: {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                body: data,
            },
        });

        // Call the original res.json with the data
        return originalJson.call(this, data);
    };

    next();
};
