import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) =>
    context.switchToHttp().getRequest().currentUser,
)
