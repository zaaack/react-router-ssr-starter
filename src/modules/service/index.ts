import { UserService } from "~/modules/service/user-service"

export function createRcpRouter() {
  return {
    user: new UserService()
  }
}

export type RpcRouter = ReturnType<typeof createRcpRouter>
