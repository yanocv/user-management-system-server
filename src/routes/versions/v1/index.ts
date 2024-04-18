import express from "express";
import { AppRouter } from "./app";
import { AuthRouter } from "./auth";
import { AnalysisRouter } from "./analysis";
import { EmployeeRouter } from "./employee";
import { CompanyRouter } from "./company";
import { DepartmentRouter } from "./department";
import { HouseStatusRouter } from "./houseStatus";
// import { DownloadRouter } from './download';
import { TopicRouter } from "./topics";
import { UserRouter } from "./user";
import { JwtAuth } from "@middlewares/JwtAuth";
// WARNING: This is test endpoint. Must be delete line below when Project implement all finished.
// import { TestRouter } from './test';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// WARNING: This is test endpoint. Must be delete line below when Project implement all finished.
// router.use('/test', TestRouter);
// router.use('/test', JwtAuth, TestRouter);

router.use("/app", AppRouter);
router.use("/auth", AuthRouter);
router.use("/analysis", JwtAuth, AnalysisRouter);
router.use("/employee", JwtAuth, EmployeeRouter);
router.use("/company", JwtAuth, CompanyRouter);
router.use("/department", JwtAuth, DepartmentRouter);
router.use("/house-status", JwtAuth, HouseStatusRouter);
// router.use('/download', DownloadRouter);
router.use("/topics", JwtAuth, TopicRouter);
router.use("/user", JwtAuth, UserRouter);

export { router as V1Router };
