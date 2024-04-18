import { Request, Response } from "express";
import archiver from "archiver";
import streams from "memory-streams";
import { Op, WhereOptions } from "sequelize";
import { DB } from "@database/index";
import { Employee, EmployeeAttributes } from "@database/models/employee.model";
import { EmployeeStatus } from "@database/models/employeeStatus.model";
import { generateAccessToken, generateRefreshToken } from "@utils/TokenHelper";

const DownloadController = {
  downloadGet: async (req: Request, res: Response) => {
    const writer = new streams.WritableStream();
    writer.on("finish", () => {
      res.set({ "Content-Type": "application/octet-stream" });
      res.set({ "Content-Disposition": "attachment; filename=download.zip" });
      console.log(writer.toBuffer());
      res.json([...writer.toBuffer()]);
    });

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    archive.pipe(writer);
    for (let i = 0; i < 10; i += 1) {
      archive.append(`テキストだよaaaaaaaaaaaaaaa${i}`, {
        name: `testfile${i}.txt`,
      });
    }
    archive.finalize();
  },
  downloadGet1: async (req: Request, res: Response) => {
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    archive.pipe(res);
    archive.append("file.txtの内容です", { name: "file.txt" });
    archive.finalize();
  },
  downloadGet2: async (req: Request, res: Response) => {
    res.json({
      message: "success get2",
    });
  },
  downloadGet3: async (req: Request, res: Response) => {
    res.json({
      message: "success get3",
    });
  },
  downloadGet4: async (req: Request, res: Response) => {
    res.json({
      message: "success get4",
    });
  },
};

export { DownloadController };
