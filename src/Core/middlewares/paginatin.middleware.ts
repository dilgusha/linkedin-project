import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../types";

export const paginationMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const before_page = (page - 1) * limit;

    req.pagination = { page, limit, before_page };
    next();
};
