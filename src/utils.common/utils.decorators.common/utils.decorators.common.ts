import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common';
import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator';
import { log } from 'console';
import { Admin } from 'src/admin/admin.entity/admin.entity';
import { AdminService } from 'src/admin/admin.service';
import { User } from 'src/users/users.entity/users.entity';
import { UsersService } from 'src/users/users.service';
// import { User } from 'src/user/user.entity/user.entity';
// import { UserService } from 'src/user/user.service';
import { ExceptionResponseDetail } from '../utils.exceptions.common/utils.exception-common';
import { HandleBase64 } from '../utils.handle-base64.common/utils.handle-base64.common';

export const RequestHeaderVerifyApiKey = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    switch (data) {
      case 'authorization':
        let verifyApiKey: string = HandleBase64.verifyApiKey(
          request.headers.authorization,
        );
        if (!verifyApiKey) {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.FORBIDDEN,
              'Vui lòng truyền api_key!',
            ), HttpStatus.OK);
        } else {
          return verifyApiKey;
        }
      default:
        throw new HttpException(
          new ExceptionResponseDetail(HttpStatus.FORBIDDEN), HttpStatus.OK);
    }
  },
);

export const GetUserFromToken = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);




export const GetAdminFromToken = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


export function UserAuthentication(bubble = true) {
  const injectUser = Inject(UsersService);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectUser(target, 'userService'); // this is the same as using constructor(private readonly logger: LoggerService) in a class
    const originalMethod = propertyDescriptor.value;
    //redefine descriptor value within own function block
    propertyDescriptor.value = async function (...args) {

      try {

        let userId: number = args[1].id;
        if (!userId) {          
          userId = args[1].req == undefined ? args[1].request.user.id : args[1].req.user.id;
        }

        let user: User = await this.usersService.findOne(userId); 
        if (user) {
          return await originalMethod.apply(this, args);
        } else {
          throw new ExceptionResponseDetail(
            HttpStatus.UNAUTHORIZED,
            'Không có quyền truy cập',
            null
          );
        }
      } catch (error) {

        throw new HttpException(
          new ExceptionResponseDetail(
            HttpStatus.BAD_REQUEST,
            "",
            error
          ), HttpStatus.OK);
      }
    };
  };
}

export function AdminAuthentication(bubble = true) {
  const injectUser = Inject(AdminService);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectUser(target, 'adminService'); // this is the same as using constructor(private readonly logger: LoggerService) in a class
    const originalMethod = propertyDescriptor.value;
    //redefine descriptor value within own function block
    propertyDescriptor.value = async function (...args) {
      try {


        let adminId: number = args[1].id;
        console.log(args);
        
        if (!adminId) {          
          adminId = args[1].req == undefined ? args[1].request.admin.id : args[1].req.admin.id;
        }


        let admin: Admin = await this.adminService.findOne(adminId);
        
        
        if (admin) {
          return await originalMethod.apply(this, args);
        } else {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.UNAUTHORIZED,
              'Không có quyền truy cập!',
            ), HttpStatus.OK,
            );
        }
      } catch (error) {
        console.log(error);
        
        throw new HttpException(
          new ExceptionResponseDetail(
            HttpStatus.UNAUTHORIZED,
            'Không có quyền truy cập!',
          ), HttpStatus.OK);
      }
    };
  };
}

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isNotEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean =>
          isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] không được để trống`,
            ), HttpStatus.OK);
        },
      },
    });
  };
}

export function IsInt(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isInt',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => !isNaN(parseInt(value)) || !value,
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          throw new HttpException(
            new ExceptionResponseDetail(
              HttpStatus.BAD_REQUEST,
              `[${validationArguments.property}] phải là kiêu số nguyên`,
            ), HttpStatus.OK);
        },
      },
    });
  };
}
