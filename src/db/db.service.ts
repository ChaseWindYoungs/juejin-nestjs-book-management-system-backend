import { access, readFile, writeFile } from 'fs/promises';
import { DbModuleOptions } from './db.module';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private options: DbModuleOptions;
  async read() {
    const filePath = this.options.path;

    try {
      // 测试用户对 path 指定的文件或目录的权限。
      await access(filePath);
    } catch (error) {
      return [];
    }

    const str = await readFile(filePath, { encoding: 'utf-8' });
    if (!str) return [];

    return JSON.parse(str);
  }
  async write(obj: Record<string, any>) {
    const filePath = this.options.path;
    await writeFile(filePath, JSON.stringify(obj, null, 2), {
      encoding: 'utf-8',
    });
  }
}
