import { handleRpc } from "typed-rpc/server";
import transcoder from "superjson";
import express,{Router} from 'express'
import { createRcpRouter, type RpcRouter } from "../modules/service";
import SSE from 'express-sse-ts'
export const sse = new SSE()


export const ApiRouter = Router()
  .use("*", express.json())
  .use("*", async (request, response, next) => {
    let body = await request.body;
    let type = request.path.split("/").pop()! as keyof RpcRouter;
    const service = createRcpRouter();
    let res = await handleRpc(body, await service[type], {
      transcoder,
    });
    response.json(res);
  })
  .use("/sse", sse.init);
