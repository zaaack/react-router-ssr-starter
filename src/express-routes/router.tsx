import { handleRpc } from "typed-rpc/server";
import transcoder from "superjson";
import express,{Router} from 'express'
import { type RpcRouter } from "../modules/service";


  // for issue test
const { createRcpRouter } = await import("../modules/service");

export const ApiRouter = Router()
  .use("/api", express.json(), async (request, response, next) => {
    let body = await request.body;
    let type = request.path.split("/").pop()! as keyof RpcRouter;
    const service = createRcpRouter();
    let res = await handleRpc(body, await service[type], {
      transcoder,
    });
    response.json(res);
  })
