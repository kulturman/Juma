import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directory } from './entities/directory.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Directory])],
    exports: [TypeOrmModule]
})
export class FileExplorerModule {}
